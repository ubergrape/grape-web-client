/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');

var events = require('events');
var closest = require('closest');
var domify = require('domify');

module.exports = RoomList;

function RoomList() {
	Emitter.call(this);
	this.rooms = [];
	this.roomIds = Object.create(null);
	this.selected = null;
	this.init();
	this.bind();
}

RoomList.prototype = Object.create(Emitter.prototype);

RoomList.prototype.init = function RoomList_init() {
	this.el = domify('<div class="roomlist"></div>');
	this.redraw();
};

RoomList.prototype.bind = function RoomList_bind() {
	var self = this;
	this.events = events(this.el, {
		addroom: function () {
			self.emit('addroom');
		},
		selectroom: function (ev) {
			var roomEl = closest(ev.target, '.room', true);
			var room = self.roomIds[roomEl.getAttribute('data-id')];
			self.emit('selectroom', room);
		}
	});
	this.events.bind('click .addroom', 'addroom');
	this.events.bind('click .room .name, .room .fa, .room .unread', 'selectroom');
};

RoomList.prototype.redraw = function RoomList_redraw() {
	this.el.innerHTML = template('roomlist', {
		rooms: this.rooms,
		selected: this.selected
	});
};

RoomList.prototype.setRooms = function RoomList_setRooms(rooms) {
	this.rooms = rooms;
	var ids = this.roomIds = Object.create(null);
	rooms.forEach(function (room) {
		ids[room.id] = room;
	});
	this.redraw();
};

RoomList.prototype.changedRoom = function RoomList_changedRoom(/*room*/) {
	this.redraw();
};

RoomList.prototype.selectRoom = function RoomList_selectRoom(room) {
	this.selected = room;
	this.redraw();
};

