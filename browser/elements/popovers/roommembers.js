/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var Emitter = require('emitter');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');

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
};

RoomMembersPopover.prototype.redraw = function RoomMembersPopover_redraw() {
	this.classes.add('members-po');
	this.classes.add('top');
	render(this.content, template('popovers/roommembers', {room: this.room}));
};

RoomMembersPopover.prototype.setRoom = function RoomMembers_setRoom(room) {
	var self = this;
	var redraw_wrapped = function(ev) {
		self.redraw();
	}

	this.room.users.off('add', redraw_wrapped);
	this.room.off('change', redraw_wrapped);
	this.room = room;
	room.users.on('add', redraw_wrapped);
	room.on('change', redraw_wrapped);
	this.redraw();
};
