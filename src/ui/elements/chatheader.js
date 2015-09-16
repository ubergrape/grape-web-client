/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var events = require('events');
var render = require('../rendervdom');
var debounce = require('debounce');
var classes = require('classes');
var constants = require('conf').constants;
var keyname = require('keyname');
var hexToRgb = require('color-converter')

module.exports = ChatHeader;

function ChatHeader() {
	Emitter.call(this);
	this.room = new Emitter({name: '', users: []});
	this.editOptions = {
		canManageRoom: false,
		renamingRoom: false
	};
	this.intercom = {
		className: 'intercom-trigger',
		icon: 'fa-question-circle',
		id: 'Intercom',
		visible: true
	};
	this.fileBrowserToggler = {
		className: 'file-browser-toggler',
		icon: 'fa-file',
		visible: true
	};
	this.membersToggler = {
		className: 'members-menu-toggler',
		icon: 'fa-user',
		visible: true
	};
	this.searchToggler = {
		className: 'search-toggler',
		icon: 'fa-search',
		visible: true
	};
	this.menuItems =[
		this.intercom,
		this.fileBrowserToggler,
		this.searchToggler,
		this.membersToggler
	];
	this.selected = null;
	this.redraw = this.redraw.bind(this);
	this.redraw();
	this.init();
	this.bind();
}

ChatHeader.prototype = Object.create(Emitter.prototype);

ChatHeader.prototype.init = function ChatHeader_init() {
	this.classes = classes(this.el);
	this.searchForm = qs('.search-form', this.el);
	this.searchInput = qs('.search', this.el);
	this.q = null;
	this.mode = 'chat';
	if (typeof Intercom !== 'undefined') {
		var intercomButton = qs(intercomSettings.widget.activator + ' a', this.el);
		intercomButton.href = 'mailto:' + intercomSettings.app_id + '@incoming.intercom.io';
		Intercom('reattach_activator');
	}
};

ChatHeader.prototype.bind = function ChatHeader_bind() {
	var self = this;

	this.events = events(this.el, {
		'toggleDeleteRoomDialog': function(e) {
			self.emit('toggledeleteroomdialog', self.room);
		},
		'toggleRoomRename': function() {
			self.editOptions.renamingRoom = true;
			self.redraw();
			var roomNameInput = qs('input.room-name', this.el);
			var roomName = roomNameInput.value;
			roomNameInput.focus();
			roomNameInput.setSelectionRange(roomName.length,roomName.length);
		},
		'stopRoomRename': function() {
			self.editOptions.renamingRoom = false;
			self.redraw();
		},
		'confirmRoomRename': function() {
			var newRoomName = qs('input.room-name', self.el).value;
			self.emit('confirmroomrename', self.room.id, newRoomName);
		}, 
		'roomRenameShortcuts' : function(e) {
			switch(keyname(e.which)) {
				case 'enter':
					this.confirmRoomRename();
				default:
					e.target.setCustomValidity('');
			}
		},
		'preventFormSubmission' : function(e) {
			e.preventDefault();
		},
		'toggleMembersMenu' : function(e) {
			self.selected = self.membersToggler == self.selected ? null : self.membersToggler;
			self.emit('toggleRightSidebar', 'user');
			self.redraw();
		},
		'toggleFileBrowser': function(e) {
			self.selected = self.fileBrowserToggler == self.selected ? null : self.fileBrowserToggler;
			self.emit('toggleRightSidebar', 'file');
			self.redraw();
		},
		'toggleSearch': function(e) {
			self.selected = self.searchToggler == self.selected ? null : self.searchToggler;
			self.emit('toggleRightSidebar', 'search');
			self.redraw();		
		}
	});

	this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog');
	this.events.bind('click div.room-name.editable', 'toggleRoomRename');
	this.events.bind('click .option-rename-cancel', 'stopRoomRename');
	this.events.bind('click .option-rename-ok', 'confirmRoomRename');
	this.events.bind('click .members-menu-toggler', 'toggleMembersMenu');
	this.events.bind('keyup input.room-name', 'roomRenameShortcuts');
	this.events.bind('submit form.room-rename', 'preventFormSubmission');
	this.events.bind('submit form.search-form', 'preventFormSubmission');
	this.events.bind('click .file-browser-toggler', 'toggleFileBrowser');
	this.events.bind('click .search-toggler', 'toggleSearch');

	var	callbacks = this.events.obj;

	document.addEventListener('keyup', function(e) {		
		if (keyname(e.which) == 'esc') callbacks.stopRoomRename();		
	});

	var startSearching = debounce(function () {
		self.emit('searching', self.q);
	}, 200, false);

	this.searchInput.addEventListener('keyup', function () {
		var q = (qs('input.search', self.el).value || this.value).replace(/^\s+|\s+$/g, '');
		if (q.length !== 0 && self.q !== q) {
			self.q = q;
			startSearching();
		} else if (q.length === 0 && self.q !== q) {
			self.q = q;
			self.emit("stopsearching");
		}
	});
};

ChatHeader.prototype.redraw = function ChatHeader_redraw() {
	var vdom = template('chatheader.jade', {
		room: this.room,
		editOptions: this.editOptions,
		mode: this.mode,
		menu: {
			items: this.menuItems,
			selected: this.selected
		}
	});

	render(this, vdom);
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	this.searchInput.value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room, msgID) {
	this.room = room;
	this.editOptions.canManageRoom = ( (this.room.creator && ui.user == this.room.creator) || ui.user.role >= constants.roles.ROLE_ADMIN) ? true : false;
	this.editOptions.renamingRoom = false;
	this.mode = msgID ? 'search' : 'chat';
	this.membersToggler.visible = room.type == 'pm' ? false : true;
	this.redraw();
};

ChatHeader.prototype.channelUpdate = function ChatHeader_channelUpdate() {
	this.editOptions.renamingRoom = false;
	this.redraw();
}

ChatHeader.prototype.roomRenameError = function ChatHeader_roomRenameError(err) {
	qs('input.room-name', this.el).setCustomValidity(err.details.msg);
	qs('input.submit-rename', this.el).click();
}

ChatHeader.prototype.onSwitchToChatMode = function ChatHeader_onSwitchToChatMode () {
	this.mode = 'chat';
	this.redraw();
}

ChatHeader.prototype.onSwitchToSearchMode = function ChatHeader_onSwitchToChatMode () {
	this.mode = 'search';
	this.redraw();
}
