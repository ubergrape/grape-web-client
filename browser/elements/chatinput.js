/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var debounce = require('debounce');

module.exports = ChatInput;

ChatInput.DELAY = 500;

function ChatInput() {
	Emitter.call(this);
	this.init();
	this.bind();
}

ChatInput.prototype = Object.create(Emitter.prototype);

ChatInput.prototype.init = function ChatInput_init() {
	this.el = document.createElement('textarea');
	this.el.className = 'input';
	this.el.autofocus = true;
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;
	inputarea(this.el).on('input', function (str) {
		if (!str)
			return;
		self.emit('input', str);
	});
	// emit typing (start and stop) events
	var delay = ChatInput.DELAY;
	var start = debounce(function () {
		self.emit('starttyping');
	}, delay, true);
	var stop = debounce(function () {
		self.emit('stoptyping');
	}, delay);
	this.el.addEventListener('keydown', function () {
		start();
	});
	this.el.addEventListener('keyup', function () {
		stop();
	});
};

