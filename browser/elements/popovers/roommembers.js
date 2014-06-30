/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var Emitter = require('emitter');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');
var Invite = require('../invite');

module.exports = RoomMembersPopover;

function RoomMembersPopover() {
	this.room = new Emitter({name: '', users: []});
	Popover.call(this);
}

RoomMembersPopover.prototype = Object.create(Popover.prototype);

RoomMembersPopover.prototype.init = function RoomMembersPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.invite = new Invite();
	classes(this.invite.el).remove('hide');
	this.el.appendChild(this.invite.el);
};

RoomMembersPopover.prototype.redraw = function RoomMembersPopover_redraw() {
	this.classes.add('members-po');
	this.classes.add('top');
	render(this.content, template('popovers/roommembers', {room: this.room}));
};

RoomMembersPopover.prototype.setRoom = function RoomMembers_setRoom(room) {
	this.room.off('change', this.redraw);
	this.room = room;
	room.on('change', function(ev){this.redraw;});
	this.redraw();
};
