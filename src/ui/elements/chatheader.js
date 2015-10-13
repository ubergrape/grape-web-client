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
var conf = require('conf');

module.exports = ChatHeader;

function ChatHeader() {
	Emitter.call(this);
	this.room = {};
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
		icon: 'fa-files-o',
		visible: true
	};
	this.userViewToggler = {
		className: 'user-view-toggler',
		icon: 'fa-user',
		visible: true
	};
	this.menuItems =[
		this.intercom,
		this.fileBrowserToggler,
		this.userViewToggler
	];
	this.selected = null;
	this.redraw = this.redraw.bind(this);
	this.redraw();
	this.init();
	this.bind();
}

ChatHeader.prototype = Object.create(Emitter.prototype);

ChatHeader.prototype.init = function() {
	this.classes = classes(this.el);
	this.searchForm = qs('.search-form', this.el);
	this.searchInput = qs('.search', this.el);
	this.q = null;
	this.isRoomManager = false;
	this.editState = {
		renaming: false,
		editingDescription: false
	}
	this.mode = 'chat';
	var intercomButton = qs('div' + window.intercomSettings.widget.activator + ' a', this.el);
	if (conf.customSupportEmailAddress) {
		intercomButton.href = 'mailto:' + conf.customSupportEmailAddress;
	}
	else if (typeof Intercom !== 'undefined') {
		intercomButton.href = 'mailto:' + window.intercomSettings.app_id + '@incoming.intercom.io';
		window.Intercom('reattach_activator');	
	}
};

ChatHeader.prototype.bind = function() {
	var self = this;
	this.events = events(this.el, this);

	this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog');
	this.events.bind('click div.room-name.editable', 'triggerRoomRename');
	this.events.bind('click .option-rename-cancel', 'stopRoomRename');
	this.events.bind('click .option-rename-ok', 'confirmRoomRename');
	this.events.bind('click .user-view-toggler', 'toggleUserView');
	this.events.bind('keyup input.room-name', 'roomRenameShortcuts');
	this.events.bind('keyup input.description', 'setDescription');
	this.events.bind('submit form', 'preventFormSubmission');
	this.events.bind('click .file-browser-toggler', 'toggleFileBrowser');
	this.events.bind('click .description-edit', 'triggerDescriptionEdit');

	document.addEventListener('keyup', function(e) {
		if (keyname(e.which) == 'esc') this.stopRoomRename();
	});

	this.searchInput.addEventListener('focus', function () {
		this.showSearch();
	}.bind(this));

	var startSearching = debounce(function () {
		this.emit('searching', this.q);
	}.bind(this), 200, false);

	this.searchInput.addEventListener('keyup', function () {
		var q = (qs('input.search', this.el).value || this.value).replace(/^\s+|\s+$/g, '');
		if (q.length !== 0 && this.q !== q) {
			this.q = q;
			startSearching();
		}
		else if (q.length === 0 && this.q !== q) {
			this.q = q;
			this.emit('stopsearching');
		}
	}.bind(this));
};

ChatHeader.prototype.redraw = function() {
	var vdom = template('chatheader.jade', {
		room: this.room,
		isRoomManager: this.isRoomManager,
		editState: this.editState,
		mode: this.mode,
		menu: {
			items: this.menuItems,
			selected: this.selected
		}
	});

	render(this, vdom);
};

ChatHeader.prototype.toggleDeleteRoomDialog = function() {
	this.emit('toggledeleteroomdialog', this.room);
}

ChatHeader.prototype.triggerRoomRename = function() {
	this.editState.renaming = true;
	this.redraw();
	var roomNameInput = qs('input.room-name', this.el);
	var roomName = roomNameInput.value;
	roomNameInput.focus();
	roomNameInput.setSelectionRange(roomName.length,roomName.length);
}

ChatHeader.prototype.stopRoomRename =  function() {
	this.editState.renaming = false;
	this.redraw();
}

ChatHeader.prototype.clearSearch = function() {
	this.searchInput.value = '';
};

ChatHeader.prototype.setRoom = function(room, msgID) {
	this.room = room;
	this.isRoomManager = (this.room.creator && ui.user == this.room.creator) || ui.user.role >= constants.roles.ROLE_ADMIN;
	this.editState.renaming = false;
	this.mode = msgID ? 'search' : 'chat';
	this.redraw();
};

ChatHeader.prototype.preventFormSubmission = function(e) {
	e.preventDefault()
}

ChatHeader.prototype.channelUpdate = function(room) {
	if (this.room != room) return;
	this.editState.editingDescription = false;
	this.editState.renaming = false;
	this.redraw();
}

ChatHeader.prototype.roomRenameError = function(err) {
	qs('input.room-name', this.el).setCustomValidity(err.details.msg);
	qs('input.submit-rename', this.el).click();
}

ChatHeader.prototype.roomRenameShortcuts = function(e) {
	switch(keyname(e.keyCode)) {
		case 'enter':
			this.confirmRoomRename();
		default:
			e.target.setCustomValidity('');
	}
}

ChatHeader.prototype.confirmRoomRename = function() {
	var newRoomName = qs('input.room-name', this.el).value;
	this.emit('confirmroomrename', this.room.id, newRoomName);
}

ChatHeader.prototype.toggleUserView = function() {
	this.selected = this.userViewToggler == this.selected ? null : this.userViewToggler;
	var mode = this.room.type == 'room' ? 'members' : 'profile';
	this.emit('toggleRightSidebar', mode);
	this.redraw();
}

ChatHeader.prototype.toggleFileBrowser = function() {
	this.selected = this.fileBrowserToggler == this.selected ? null : this.fileBrowserToggler;
	this.emit('toggleRightSidebar', 'file');
	this.redraw();	
}

ChatHeader.prototype.showSearch = function() {
	this.selected = null;
	this.emit('showSearch', 'search');
	this.redraw();
}

ChatHeader.prototype.triggerDescriptionEdit = function() {
	this.editState.editingDescription = true;
	this.redraw();
	var inputDescription = qs('input.description', this.el);
	var onBlur = function() {
		this.stopDescriptionEdit()
	}.bind(this)
	// unfortunately our events.bind method has no support or
	// does not work for blur events, so here is a workaround
	inputDescription.removeEventListener('blur', onBlur);
	inputDescription.focus();
	inputDescription.addEventListener('blur', onBlur);
}

ChatHeader.prototype.stopDescriptionEdit = function() {
	this.editState.editingDescription = false;
	this.redraw();
}

ChatHeader.prototype.setDescription = function(e) {
	if (keyname(e.keyCode) !== 'enter') return;
	this.emit('setDescription', this.room, e.target.value);
}

ChatHeader.prototype.onSwitchToChatMode = function() {
	this.mode = 'chat';
	this.redraw();
}

ChatHeader.prototype.onSwitchToSearchMode = function() {
	this.mode = 'search';
	this.redraw();
}
