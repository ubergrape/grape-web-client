/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var resizable = require('resizable-textarea');
var debounce = require('debounce');
var textcomplete = require('textcomplete');
var qs = require('query');
var closest = require('closest');
var style = require('computed-style');
var events = require('events');
var classes = require('classes');
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
		if (!self.editing) {
			self.emit('input', self.room, str/*, {
				attachments: self.attachments
			}*/);
			//self.attachments = [];
		} else {
			self.emit('update', self.editMsg, str);
			self.editingDone();
		}
	});

	// make the textarea auto resize
	var resize = debounce(function() {
		resizable(self.textarea, {min: 31, max: 220})}, delay);
	resize();

	Emitter(this.textarea);
	this.textarea.on('resize', function(diff) {
		// resize footer height
		var footer = closest(self.textarea, 'footer');
		var new_height = footer.clientHeight + diff;
		footer.style.height =  new_height + 'px';

		// resize chat wrapper padding
		var wrapper = qs(".chat-wrapper");
		var new_padding_bottom = parseInt(style(wrapper).paddingBottom) + diff;
		wrapper.style.paddingBottom =  new_padding_bottom + 'px';
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
	
	document.addEventListener('keyup', function (ev) {
		if (!self.editing) return;
		if (ev.keyCode == 27) self.editingDone();
	});

	// hook up the autocomplete
	this.complete.re = /@(\w{1,15})$/; // TODO: customize the regexp
	this.complete.formatSelection = function (option) {
		return option.title;
	};
	this.complete.query = function (matches) {
		// XXX: implement matching logic and populate with real results
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
	if (this.editing)
		this.editingDone();
};

ChatInput.prototype.moveCaretToEnd = function ChatInput_moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

ChatInput.prototype.editMessage = function ChatInput_editMessage(msg) {
	this.editMsg = msg;
	this.editing = true;
	classes(this.el).add('editing');
	this.oldVal = this.textarea.value;
	this.textarea.value = msg['text'];
	this.textarea.focus();
    this.moveCaretToEnd(this.textarea);
}

ChatInput.prototype.editingDone = function ChatInput_editingDone() {
	this.emit('editingdone', this.editMsg);
	this.editing = false;
	this.textarea.value = this.oldVal;
	this.oldVal = null;
	this.editMsg = null;
	classes(this.el).remove('editing');
	this.textarea.focus();
}

/*
ChatInput.prototype.addAttachment = function ChatInput_addAttachment(attachment) {
	this.attachments.push(attachment.id);
};
*/
