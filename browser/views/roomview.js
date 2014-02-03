/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var domify = require('domify');
var template = require('template');

module.exports = RoomView;

function qs(s) {
	return document.querySelector(s);
}

function RoomView(room) {
	Emitter.call(this);
	this.room = undefined;

	this.history = qs('.chathistory');
	this.input = qs('.input');
	this.roomname = qs('.roomname');
	this.usersonline = qs('.usersonline');

	this._bindInput();

	if (room)
		this.setRoom(room);
}

RoomView.prototype = Object.create(Emitter.prototype);

RoomView.prototype._bindInput = function RoomView__bindInput() {
	var self = this;
	inputarea(this.input).on('input', function (str) {
		if (!str)
			return;
		self.emit('input', str);
	});
};

RoomView.prototype.setRoom = function RoomView_setRoom(room) {
	if (this.room) {
		this.room.off('change history');
		this.room.off('change users');
		while (this.history.firstChild)
			this.history.removeChild(this.history.firstChild);
	}
	var self = this;
	this.room = room;
	room.unread = 0;

	// bind to room meta changes
	this.roomname.innerHTML = room.name;
	function drawRoomUsers() {
		self.usersonline.innerHTML = template('roommeta', room);
	}
	drawRoomUsers();
	room.on('change users', drawRoomUsers);

	var history = this.history;
	// bind to history changes
	room.on('change history', function (event, line) {
		if (event !== 'add')
			return;
		addLine(line);
		// clear the number of unread messages
		room.unread = 0;
	});
	// and render all the history we already have:
	room.history.forEach(addLine);

	function addLine(line) {
		var oldEl;
		function redraw() {
			var el = domify(template('chatline', line));
			if (oldEl) {
				history.replaceChild(el, oldEl);
			} else {
				history.appendChild(el);
				// FIXME: scroll into view, for now. Later this should really reflect
				// the reading status, and also track which lines are completely
				// visible and have been read
				var parent = history.parentNode;
				parent.scrollTop = parent.scrollHeight - parent.clientHeight;
			}
			oldEl = el;
		}
		redraw();
		// FIXME: unsubscribe from this!
		line.readers.on('add', redraw);
		line.readers.on('remove', redraw);
	}
};
