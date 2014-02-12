/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var domify = require('domify');
var template = require('template');
var classes = require('classes');
var throttle = require('throttle');

// WTFjshint
var focus = require('../focus'); // jshint ignore:line
var InfiniteScroll = require('../infinite-scroll');

module.exports = RoomView;

function qs(s) {
	return document.querySelector(s);
}

function RoomView(app, room) {
	Emitter.call(this);
	this.app = app;
	this.room = undefined;

	this.history = qs('.chathistory');
	this.input = qs('.input');
	this.roomname = qs('.roomname');
	this.usersonline = qs('.usersonline');
	this.scrollWindow = qs('.chat');
	this._bindScroll();
	this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 50);
	this.scrollMode = 'automatic';
	// FIXME: WeakMap shim?
	this.elemMap = new WeakMap();

	this._bindInput();

	if (room)
		this.setRoom(room);
}

RoomView.prototype = Object.create(Emitter.prototype);

RoomView.prototype._scrolled = function RoomView__scrolled(direction, done) {
	// set the scrollMode to automatic when scrolling to the bottom
	if (direction === 'bottom') {
		this.scrollMode = 'automatic';
		return done();
	}
	var oldestLine = this.room.history[0];
	var options = {time_to: oldestLine.time};
	this.app.getHistory(this.room, options, function (lines) {
		// only acknowledge this when we are not at the end of the history
		if (lines.length)
			done();
	});
};

RoomView.prototype._bindInput = function RoomView__bindInput() {
	var self = this;
	inputarea(this.input).on('input', function (str) {
		if (!str)
			return;
		self.emit('input', str);
	});
};

RoomView.prototype._bindScroll = function RoomView__bindScroll() {
	var self = this;
	function updateRead() {
		setTimeout(function () {
			var lastRead = self.elemMap.get(self.lastRead);
			if (!lastRead)
				return;
			var thisElem = self._findBottomVisible();
			var thisRead = self.elemMap.get(thisElem);
			if (lastRead.time < thisRead.time)
				self._setLastRead(thisElem);
		}, 2500);
	}
	focus.on('focus', updateRead);
	this.scrollWindow.addEventListener('scroll', throttle(updateRead, 500));
	this.scrollWindow.addEventListener('scroll', function () {
		self.scrollMode = 'manual';
	});
};

RoomView.prototype._findBottomVisible = function RoomView__findBottomVisible() {
	var history = this.history;
	var scrollWindow = this.scrollWindow;
	var scrollBottom = scrollWindow.offsetTop + scrollWindow.scrollTop + scrollWindow.clientHeight;
	for (var i = history.children.length - 1; i >= 0; i--) {
		var child = history.children[i];
		var childBottom = child.offsetTop + child.offsetHeight;
		if (childBottom <= scrollBottom)
			return child;
	}
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
	// reset, otherwise we won’t get future events
	this.scroll.reset();
	// and make scrolling mode automatic
	this.scrollMode = 'automatic';
	this.unread = [];

	// bind to room meta changes
	this.roomname.innerHTML = room.name;
	function drawRoomUsers() {
		self.usersonline.innerHTML = template('roommeta', room);
	}
	drawRoomUsers();
	room.on('change users', drawRoomUsers);

	// draw all the messages we have so far:
	// FIXME: rework the unread messages handling when changing the room
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

RoomView.prototype._setLastRead = function RoomView__setLastRead(el) {
	// clear the number of read items
	var index = this.unread.indexOf(el);
	if (~index) {
		index++;
		this.unread.splice(0, index);
		this.room.unread-= index;
	}
	if (this.lastRead)
		classes(this.lastRead).remove('read');
	this.lastRead = el;
	classes(this.lastRead).add('read');
};

RoomView.prototype._newLine = function RoomView__newLine(line, index) {
	var history = this.history;

	var el = domify(template('chatline', line));
	this.elemMap.set(el, line);
	if (index !== history.children.length) {
		// when prepending history, make sure to not modify the current scrolling
		// offset
		var sH = this.scrollWindow.scrollHeight;
		history.insertBefore(el, history.children[index]);
		this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - sH;
		return;
	}
	history.appendChild(el);

	if (this.scrollMode === 'automatic' && focus.state === 'focus') {
		// when the window has the focus, we assume the message was read
		this._setLastRead(el);
	} else {
		// when the window does not have focus, we count this toward the
		// unread messages
		this.unread.push(el);
		this.room.unread++;
	}
	if (this.scrollMode === 'automatic' && this.lastRead) {
		// scroll the last read message into view, on the top
		// This makes sure the last read message is on the top, it scrolls as far
		// to the bottom as necessary to have it still in the scrolling view
		this.lastRead.scrollIntoView();
		// if the scroll left something on the bottom, set scrolling to manual
		var elem = this.scrollWindow;
		var sT = elem.scrollTop;
		var sTM = elem.scrollTopMax || Math.max(elem.scrollHeight - elem.clientHeight, 0);
		if (sT < sTM)
			this.scrollMode === 'manual';
	}
};

