/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var Emitter = require('emitter');
var v = require('virtualdom');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');
var dialog = require('dialog');
var domify = require('domify');


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
};

RoomMembersPopover.prototype.bind=  function RoomMembersPopover_bind() {
	Popover.prototype.bind.call(this);
	this.events.obj.deleteRoom = this.deleteRoom.bind(this);
	this.events.bind('click .delete-room', 'deleteRoom');
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

RoomMembersPopover.prototype.deleteRoom = function RoomMembersPopover_deleteRoom(ev) {
	ev.preventDefault();
	var x = v.toDOM(template('deleteroom', {
		room: this.room
	}));
	var d = dialog("really?", x).closable().show()
	// this.emit('deleteroom', this.room);
};
