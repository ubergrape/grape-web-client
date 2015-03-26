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

RoomMembersPopover.prototype.bind=  function RoomMembersPopover_bind() {
	var self = this;
	Popover.prototype.bind.call(this);
	this.events = events(this.el, {
		openInternalLink : function(ev) {
			ev.preventDefault();
			var url = ev.delegateTarget.href;
			self.emit('selectchannelfromurl', url);
			self.hide();
		}
	});
	this.events.bind('click a.member-link', 'openInternalLink');
};

RoomMembersPopover.prototype.redraw = function RoomMembersPopover_redraw() {
	this.classes.add('members-po');
	this.classes.add('top');
	render(this.content, template('popovers/roommembers.jade', {room: this.room}));
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
	this.redraw();
};

RoomMembersPopover.prototype.leftChannel = function RoomMembersPopover_leftChannel(room) {
	if (room == this.room) this.redraw();
}
