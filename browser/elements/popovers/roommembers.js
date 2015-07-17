/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var Emitter = require('emitter');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');
var qs = require('query');
var events = require('events');
var broker = require('broker');
var constants = require('cglib').constants;

module.exports = RoomMembersPopover;

function RoomMembersPopover() {
	this.room = new Emitter({name: '', users: new Emitter([])});
	Popover.call(this);
}

RoomMembersPopover.prototype = Object.create(Popover.prototype);

RoomMembersPopover.prototype.init = function RoomMembersPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.canKickMembers = false;
};

RoomMembersPopover.prototype.bind=  function RoomMembersPopover_bind() {
	var self = this;
	Popover.prototype.bind.call(this);
	this.events.obj.deleteRoomMember = function (ev) {
		var roomID = this.room.id;
		var memberID = ev.target.getAttribute('data-id');
		this.emit('kickMember', roomID, memberID);
	}.bind(this);
	this.events.bind('click span.btn-delete', 'deleteRoomMember');
};

RoomMembersPopover.prototype.redraw = function RoomMembersPopover_redraw() {
	this.classes.add('members-po');
	this.classes.add('top');
	render(this.content, template('popovers/roommembers.jade', {
		room: this.room,
		canKickMembers: this.canKickMembers
	}));
};

/* scroll down in the members list */
RoomMembersPopover.prototype.scrollDown = function RoomMembersPopover_scrollDown() {
	var list = qs('.user-list', this.el);
	var scrollHeight = list.scrollHeight;
	list.scrollTop = scrollHeight;
};

RoomMembersPopover.prototype.setRoom = function RoomMembers_setRoom(room) {
	var self = this;
	var redraw_wrapped = function(ev) {
		self.redraw();
	};
	var user_added = function(ev) {
		self.redraw();
		self.scrollDown();
	};
	this.room.users.off('add', user_added);
	this.room.off('change', redraw_wrapped);
	this.room = room;
	room.users.on('add', user_added);
	room.on('change', redraw_wrapped);
	this.canKickMembers = ui.user === room.creator || ui.user.role >= constants.ROLE_ADMIN ? true : false;
	this.redraw();
	if (!this.hidden) this.hide();
};

RoomMembersPopover.prototype.onMemberLeftChannel = function RoomMembersPopover_onMemberLeftChannel(room) {
	if (room == this.room) this.redraw();
}
