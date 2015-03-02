/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var events = require('events');
var render = require('../rendervdom');
var debounce = require('debounce');
var classes = require('classes');
var broker = require('broker');
var DeleteRoomDialog = require('./dialogs/deleteroom');

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
		}
	});

	this.events.bind('click .user-menu-wrap', 'toggleUserMenu');

	this.events.bind('click .option-add-users', 'toggleMembersMenu1');
	this.events.bind('click .room-menu-wrap', 'toggleMembersMenu');
	
	this.events.obj.deleteRoom = this.deleteRoom.bind(this);
	this.events.bind('click .option-delete-room', 'deleteRoom');

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
	var activeUsers = this.room.users.filter(function(user) {
		return user.active || user == ui.user;
	});
	var hiddenUsersCount = activeUsers.length > this.limitUsersTo ? activeUsers.length - this.limitUsersTo : 0; 
	var vdom = template('chatheader.jade', {
		room: this.room,
		limitUsersTo: this.limitUsersTo,
		hiddenUsersCount: hiddenUsersCount
	});
	render(this, vdom);
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	this.searchInput.value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room) {
	this.room.off('change', this.redraw);
	this.room = room;
	room.on('change', this.redraw);
	this.redraw();
};


ChatHeader.prototype.deleteRoom = function ChatHeader_deleteRoom(ev) {
	ev.preventDefault();
	var d = new DeleteRoomDialog({
		room: this.room
	}).closable().overlay().show();
	broker.pass(d, 'deleteroom', this, 'deleteroom');
};

ChatHeader.prototype.dr = function DeleteRoomDialog_deleteroom(room, password, callback) {
	console.log("Delete Room");
};
