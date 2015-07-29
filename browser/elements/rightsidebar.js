/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var Emitter = require('emitter');
var render = require('../rendervdom');
var classes = require('classes');
var qs = require('query');
var events = require('events');
var broker = require('broker');
var constants = require('cglib').constants;

module.exports = RightSidebar;

function RightSidebar() {
	Emitter.call(this);
	this.room = new Emitter({name: '', users: []});
	this.init();
	this.bind();
}

RightSidebar.prototype = Object.create(Emitter.prototype);

RightSidebar.prototype.init = function RightSidebar_init() {
	this.el = document.createElement('div');
	this.classes = classes(this.el);
	this.redraw();
	this.canKickMembers = false;
};

RightSidebar.prototype.bind = function RightSidebar_bind() {
	var self = this;
	this.events = events(this.el, {
		close: function () {
			self.hide();
		}
	});
	this.events.obj.deleteRoomMember = function (ev) {
		var roomID = this.room.id;
		var memberID = ev.target.getAttribute('data-id');
		this.emit('kickMember', roomID, memberID);
	}.bind(this);
	this.events.bind('click span.btn-delete', 'deleteRoomMember');
};

RightSidebar.prototype.redraw = function RightSidebar_redraw() {
	var vdom = template('rightsidebar.jade', {
		room: this.room,
		userCount: this.room.users.length,
		canKickMembers: this.canKickMembers
	});

	render(this, vdom);
};

/* scroll down in the members list */
RightSidebar.prototype.scrollDown = function RightSidebar_scrollDown() {
	var list = qs('.user-list', this.el);
	var scrollHeight = list.scrollHeight;
	list.scrollTop = scrollHeight;
};

RightSidebar.prototype.setRoom = function RoomMembers_setRoom(room) {
	var self = this;
	var redraw_wrapped = function(ev) {
		self.redraw();
	};
	var user_added = function(ev) {
		self.redraw();
		self.scrollDown();
	};
	this.room = room;
	room.users.off('add', user_added);
	room.off('change', redraw_wrapped);
	room.users.on('add', user_added);
	room.on('change', redraw_wrapped);
	this.canKickMembers = ui.user === room.creator || ui.user.role >= constants.ROLE_ADMIN ? true : false;
	this.redraw();
};

RightSidebar.prototype.onMemberLeftChannel = function RightSidebar_onMemberLeftChannel(room) {
	if (room == this.room) this.redraw();
}

RightSidebar.prototype.toggle = function RightSidebar_toggle() {
	var rightSidebar = qs('.right-sidebar', self.el)
	rightSidebar.classList.toggle("right-sidebar-show")

	var mainWindow = qs('.main-window', self.el)
	mainWindow.classList.toggle("main-window-minimize")
}
