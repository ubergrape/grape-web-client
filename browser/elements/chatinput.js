/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var debounce = require('debounce');

module.exports = ChatInput;

ChatInput.DELAY = 500;

function ChatInput() {
	Emitter.call(this);
	this.room = null;
	this.init();
	this.bind();
}

ChatInput.prototype = Object.create(Emitter.prototype);

ChatInput.prototype.init = function ChatInput_init() {
	this.el = document.createElement('textarea');
	this.el.className = 'input';
	this.el.autofocus = true;
	this.el.disabled = true;
	this.input = inputarea(this.el);
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;
	this.input.on('input', function (str) {
		str = str.trim();
		if (!str)
			return;
		doStop();
		self.emit('input', self.room, str);
	});
	// emit typing (start and stop) events
	var delay = ChatInput.DELAY;
	var stopped = false;
	var start = debounce(function () {
		stopped = false;
		self.emit('starttyping', self.room);
	}, delay, true);
	function doStop() {
		if (stopped) return;
		stopped = true;
		self.emit('stoptyping', self.room);
	}
	var stop = debounce(doStop, delay);
	this.el.addEventListener('keydown', function () {
		start();
	});
	this.el.addEventListener('keyup', function () {
		stop();
	});
};

ChatInput.prototype.setRoom = function ChatInput_setRoom(room) {
	this.room = room;
	this.el.disabled = !room;
};
