/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var debounce = require('debounce');
var textcomplete = require('textcomplete');
var qs = require('query');

var template = require('template');
var render = require('../rendervdom');

module.exports = ChatInput;

ChatInput.DELAY = 500;

function ChatInput() {
	Emitter.call(this);
	this.room = null;
	//this.attachments = [];
	this.init();
	this.bind();
}

ChatInput.prototype = Object.create(Emitter.prototype);

ChatInput.prototype.init = function ChatInput_init() {
	this.redraw();
	this.textarea = qs('textarea', this.el);
};

ChatInput.prototype.redraw = function ChatInput_redraw() {
	var vdom = template('chatinput', {});
	render(this, vdom);
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;
	this.complete = textcomplete(this.textarea, qs('.autocomplete', this.el));

	// XXX: textcomplete uses `keydown` to do the completion and calls
	// `stopPropagation()`. But inputarea uses `keyup` to trigger an input.
	// To work around this, we hook up our own `keyup` which is called before
	// inputareas, so we can `stopImmediatePropagation()` the event before it
	// reaches inputarea.
	var isCompleting = false;
	this.complete.on('change', function () {
		isCompleting = true;
	});
	this.textarea.addEventListener('keyup', function (ev) {
		if (!isCompleting) return;
		ev.stopImmediatePropagation();
		isCompleting = false;
	});

	// hook up the input
	this.input = inputarea(this.textarea);
	this.input.on('input', function (str) {
		str = str.trim();
		if (!str)
			return;
		doStop();
		self.emit('input', self.room, str/*, {
			attachments: self.attachments
		}*/);
		//self.attachments = [];
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
	this.textarea.addEventListener('keypress', function () {
		start();
		stop();
	});

	// hook up the autocomplete
	this.complete.re = /@(\w{1,15})$/; // TODO: customize the regexp
	this.complete.formatSelection = function (option) {
		return option.title;
	};
	this.complete.query = function (matches) {
		// XXX: implement matching logic and populate with real results
		console.log(matches);
		self.complete.clear();
		self.complete.show();
		self.complete.push([
			'first', 'second'
		]);
		self.complete.highlight(0);
	};
};

ChatInput.prototype.setRoom = function ChatInput_setRoom(room) {
	this.room = room;
	this.textarea.disabled = !room;
	if (room) this.textarea.focus();
};
/*
ChatInput.prototype.addAttachment = function ChatInput_addAttachment(attachment) {
	this.attachments.push(attachment.id);
};
*/
