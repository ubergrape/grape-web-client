/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var domify = require('domify');
var template = require('template');

var focus = require('../focus');

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

	// bind to room meta changes
	this.roomname.innerHTML = room.name;
	function drawRoomUsers() {
		self.usersonline.innerHTML = template('roommeta', room);
	}
	drawRoomUsers();
	room.on('change users', drawRoomUsers);

	// draw all the messages we have so far:
	room.unread = 0;
	this.history.innerHTML = room.history.map(function (line) {
		return template('chatline', line);
	}).join('');
	// mark the last message as read
	this.lastRead = this.history.lastChild;
	// and scroll to the last read message
	if (this.lastRead)
		this.lastRead.scrollIntoView();

	// react to new messages
	room.on('change history', function (event, line, index) {
		if (event !== 'add')
			return;
		self._newLine(line, index);
	});
};

RoomView.prototype._newLine = function RoomView__newLine(line, index) {
	var history = this.history;

	var el = domify(template('chatline', line));
	if (index !== history.children.length) {
		// when prepending history, do not do any special handling
		history.insertBefore(el, history.children[index]);
		return;
	}
	history.appendChild(el);
	if (focus.state === 'focus') {
		// when the window has the focus, we assume the message was read
		this.lastRead = el;
	} else {
		// when the window does not have focus, we count this toward the
		// unread messages
		this.room.unread++;
	}
	// scroll the last read message into view for now. later this should be a lot
	// more sophisticated
	if (this.lastRead)
		this.lastRead.scrollIntoView();
};

