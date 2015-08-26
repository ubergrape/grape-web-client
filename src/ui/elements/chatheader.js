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
	this.tagsToggle = qs('#tagsToggle', this.el);
	this.menuToggle = qs('#menuToggle', this.el);
	this.q = null;
	this.editOptions = {
		canRenameRoom: false,
		renamingRoom: false
	};
	this.mode = 'chat';
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
			var newRoomName = qs('input.room-name', this.el).value;
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
		'toggleTags' : function(e) {
			var color = {r: 100, g: 50, b: 100};

			if (self.room.color)
				color = hexToRgb(self.room.color.toLowerCase());

			if (tagsToggle.className == "room-header-button") {
				if (menuToggle.className == "room-header-button")
					self.emit('toggleRightSidebar');

				tagsToggle.className = "room-header-button-active"
				tagsToggle.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.75)";

				menuToggle.className = "room-header-button"
				menuToggle.style.background = "";
			} else {
				tagsToggle.className = "room-header-button"
				tagsToggle.style.background = "";

				self.emit('toggleRightSidebar');
			}

			qs('.right-sidebar-room-info').style.display = "none";
			qs('.right-sidebar-tags').style.display = "block";
		},
		'toggleMenu' : function(e) {
			var color = {r: 100, g: 50, b: 100};

			if (self.room.color) {
				color = hexToRgb(self.room.color.toLowerCase());
			}

			if (menuToggle.className == "room-header-button") {
				if (tagsToggle.className == "room-header-button")
					self.emit('toggleRightSidebar');

				menuToggle.className = "room-header-button-active"
				menuToggle.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.75)";

				tagsToggle.className = "room-header-button"
				tagsToggle.style.background = "";
			} else {
				menuToggle.className = "room-header-button"
				menuToggle.style.background = "";

				self.emit('toggleRightSidebar');
			}

			qs('.right-sidebar-room-info').style.display = "block";
			qs('.right-sidebar-tags').style.display = "none";
		}
	});

	this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog');
	this.events.bind('click div.room-name.editable', 'toggleRoomRename');
	this.events.bind('click .option-rename-cancel', 'stopRoomRename');
	this.events.bind('click .option-rename-ok', 'confirmRoomRename');
	this.events.bind('click #tagsToggle', 'toggleTags');
	this.events.bind('click #menuToggle', 'toggleMenu');
	this.events.bind('keyup input.room-name', 'roomRenameShortcuts');
	this.events.bind('submit form.room-rename', 'preventFormSubmission');
	this.events.bind('submit form.search-form', 'preventFormSubmission');

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
	var color = {r: 100, g: 50, b: 100};

	if (this.room.color) {
		color = hexToRgb(this.room.color.toLowerCase());
	}

	var vdom = template('chatheader.jade', {
		room: this.room,
		editOptions: this.editOptions,
		mode: this.mode,
		color: color
	});

	render(this, vdom);

	if (qs('.room-header-button-active'))
		qs('.room-header-button-active').style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.75)";
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	this.searchInput.value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room, msgID) {
	this.room.off('change', this.redraw);
	this.room = room;
	this.editOptions.canRenameRoom = ( (this.room.creator && ui.user == this.room.creator) || ui.user.role >= constants.ROLE_ADMIN) ? true : false;
	this.editOptions.renamingRoom = false;
	this.mode = msgID ? 'search' : 'chat',
	room.on('change', this.redraw);

	// TODO remove this when sidebar becomes useful for PMs too!
	if (room.type == "room") {
		qs('.right-sidebar').style.display = "block"
	} else {
		qs('.right-sidebar').style.display = "none"
	}

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

ChatHeader.prototype.onNewRoomMember = function ChatHeader_onNewRoomMember(room) {
	if (room == this.room) this.redraw();
}

ChatHeader.prototype.onMemberLeftChannel = function ChatHeader_onMemberLeftChannel(room) {
	if (room == this.room) this.redraw();
}

ChatHeader.prototype.onSwitchToChatMode = function ChatHeader_onSwitchToChatMode () {
	this.mode = 'chat';
	this.redraw();
}

ChatHeader.prototype.onSwitchToSearchMode = function ChatHeader_onSwitchToChatMode () {
	this.mode = 'search';
	this.redraw();
}
