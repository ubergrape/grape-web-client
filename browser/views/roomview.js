/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var domify = require('domify');
var template = require('template');
var throttle = require('throttle');
var debounce = require('debounce');

// WTFjshint
var focus = require('../focus'); // jshint ignore:line
var InfiniteScroll = require('../infinite-scroll');
var Line = require('../../lib').models.Line; // TODO: clean this up a bit

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

	this._lineMap = Object.create(null);

	this._bindScroll();
	this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 50);
	this.scrollMode = 'automatic';


	this._bindInput();
	this._bindChange();

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

// react to changes to chat line and redraw that accordingly
RoomView.prototype._bindChange = function RoomView__bindChange() {
	var self = this;
	Line.on('change', function (line) {
		var elem = self._lineMap[line.id];
		if (!elem)
			return;
		var newElem = domify(template('chatline', line));
		elem.parentNode.replaceChild(newElem, elem);
	});
};

RoomView.prototype._bindInput = function RoomView__bindInput() {
	var self = this;
	inputarea(this.input).on('input', function (str) {
		if (!str)
			return;
		self.emit('input', str);
	});
	// emit typing (start and stop) events
	var delay = 500;
	var start = debounce(function () {
		self.app.setTyping(self.room, true);
	}, delay, true);
	var stop = debounce(function () {
		self.app.setTyping(self.room, false);
	}, delay);
	this.input.addEventListener('keypress', function () {
		start();
		stop();
	});
};

RoomView.prototype._bindScroll = function RoomView__bindScroll() {
	var self = this;
	function updateRead() {
		setTimeout(function () {
			if (focus.state !== 'focus')
				return; // we get scroll events even when the window is not focused
			var bottomElem = self._findBottomVisible();
			var line = Line.get(bottomElem.getAttribute('data-id'));
			self.app.setRead(self.room, line);
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
	var self = this;
	var history = this.history;
	if (this.room) {
		this.room.off('change history');
		this.room.off('change users');
		this.room.off('change name');
		while (history.firstChild)
			history.removeChild(history.firstChild);
	}
	this.room = room;
	// reset, otherwise we won’t get future events
	this.scroll.reset();
	// and make scrolling mode automatic
	this.scrollMode = 'automatic';
	// reset the line map
	this._lineMap = Object.create(null);

	// bind to room meta changes
	this.roomname.innerHTML = room.name;
	room.on('change name', function () {
		self.roomname.innerHTML = room.name;
	});
	function drawRoomUsers() {
		self.usersonline.innerHTML = template('roommeta', room);
	}
	drawRoomUsers();
	room.on('change users', drawRoomUsers);

	// mark the last message as read
	if (room.history.length)
		this.app.setRead(room, room.history[room.history.length - 1]);
	else
		this.app.getHistory(room);

	// draw all the messages we have so far:
	room.history.forEach(function (line) {
		var elem = domify(template('chatline', line));
		self._lineMap[line.id] = elem;
		history.appendChild(elem);
	});

	
	// scroll to the last read message
	//history.lastChild.scrollIntoView();

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
		// when prepending history, make sure to not modify the current scrolling
		// offset
		var sH = this.scrollWindow.scrollHeight;
		history.insertBefore(el, history.children[index]);
		this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - sH;
		return;
	}
	history.appendChild(el);

	if (this.scrollMode === 'automatic') {
		if (focus.state === 'focus') {
			// when the window has the focus, we assume the message was read
			this.app.setRead(this.room, line);
			return;
		}
		// scroll the last read message into view, on the top
		// This makes sure the last read message is on the top, it scrolls as far
		// to the bottom as necessary to have it still in the scrolling view
		history.children[history.children.length - 1 - this.room.unread]
			.scrollIntoView();
		// if the scroll left something on the bottom, set scrolling to manual
		var elem = this.scrollWindow;
		var sT = elem.scrollTop;
		var sTM = elem.scrollTopMax || Math.max(elem.scrollHeight - elem.clientHeight, 0);
		if (sT < sTM)
			this.scrollMode === 'manual';
	}
};

