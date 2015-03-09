/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var events = require('events');
var render = require('../rendervdom');
var debounce = require('debounce');
var classes = require('classes');

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
	this.q = null;
	this.limitUsersTo = 5;
	this.editOptions = {
		canEditRoomName: false,
		editingRoomName: false
	};
};

ChatHeader.prototype.bind = function ChatHeader_bind() {
	var self = this;

	this.events = events(this.el, {
		'toggleUserMenu': function () {
			self.emit('toggleusermenu', qs('.user-menu-wrap', self.el));
		},
		'toggleMembersMenu': function (e) {
			self.emit('togglemembersmenu', qs('.room-users-wrap', self.el));
		},
		'toggleMembersMenu1': function (e) {
			self.emit('togglemembersmenu', qs('.option-add-users', self.el));
		},
		'toggleDeleteRoomDialog': function(e) {
			self.emit('toggledeleteroomdialog', self.room);
		},
		'toggleEditRoomName': function() {
			self.editOptions.editingRoomName = true;
			self.redraw();
			qs('input.room-name', this.el).focus();
		},
		'stopEditRoomName': function() {
			self.editOptions.editingRoomName = false;
			self.redraw();
		},
		'confirmEditRoomName': function() {
			self.emit('confirmnewroomname');
		}
	});

	this.events.bind('click .user-menu-wrap', 'toggleUserMenu');
	this.events.bind('click .option-add-users', 'toggleMembersMenu1');
	this.events.bind('click .room-users-wrap', 'toggleMembersMenu');
	this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog');
	this.events.bind('click .room-name.editable', 'toggleEditRoomName');
	this.events.bind('click .option-rename-room', 'toggleEditRoomName');
	this.events.bind('click .option-rename-cancel', 'stopEditRoomName');
	this.events.bind('click .option-rename-ok', 'confirmEditRoomName');

	this.searchForm.addEventListener('submit', function (ev) {
		ev.preventDefault();
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
	var totUsers = this.room.users.length;
	var hiddenUsersCount = totUsers > this.limitUsersTo ? totUsers - this.limitUsersTo : 0;
	var vdom = template('chatheader.jade', {
		room: this.room,
		limitUsersTo: this.limitUsersTo,
		hiddenUsersCount: hiddenUsersCount,
		editOptions: this.editOptions
	});
	render(this, vdom);
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	this.searchInput.value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room) {
	this.room.off('change', this.redraw);
	this.room = room;
	this.editOptions.canEditRoomName = ( (this.room.creator && ui.user == this.room.creator) || ui.user.role > 0) ? true : false;
	room.on('change', this.redraw);
	this.redraw();
};
