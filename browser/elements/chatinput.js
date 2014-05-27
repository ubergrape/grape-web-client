/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var inputarea = require('inputarea');
var debounce = require('debounce');
var textcomplete = require('textcomplete');
var qs = require('query');
var closest = require('closest');
var style = require('computed-style');
var events = require('events');
var classes = require('classes');
var template = require('template');
var render = require('../rendervdom');
var attr = require('attr');
require("startswith");

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
	this.messageInput = qs('.messageInput', this.el);
};

ChatInput.prototype.redraw = function ChatInput_redraw() {
	var vdom = template('chatinput', {});
	render(this, vdom);
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;
	this.complete = textcomplete(this.messageInput, qs('.autocomplete', this.el));

	// XXX: textcomplete uses `keydown` to do the completion and calls
	// `stopPropagation()`. But inputarea uses `keyup` to trigger an input.
	// To work around this, we hook up our own `keyup` which is called before
	// inputareas, so we can `stopImmediatePropagation()` the event before it
	// reaches inputarea.
	var isCompleting = false;
	this.complete.on('change', function () {
		isCompleting = true;
	});
	this.messageInput.addEventListener('keyup', function (ev) {
		if (!isCompleting) return;
		ev.stopImmediatePropagation();
		isCompleting = false;
	});

	// hook up the input
	this.input = inputarea(this.messageInput);
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

	// // make the messageInput auto resize
	// var resize = debounce(function() {
	// 	resizable(self.messageInput, {min: 31, max: 220})}, delay);
	// resize();

	// Emitter(this.messageInput);
	// this.messageInput.on('resize', function(diff) {
	// 	// resize footer height
	// 	var footer = closest(self.messageInput, 'footer');
	// 	var new_height = footer.clientHeight + diff;
	// 	footer.style.height =  new_height + 'px';

	// 	// resize chat wrapper padding
	// 	var wrapper = qs(".chat-wrapper");
	// 	var new_padding_bottom = parseInt(style(wrapper).paddingBottom) + diff;
	// 	wrapper.style.paddingBottom =  new_padding_bottom + 'px';
	// });

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
	this.messageInput.addEventListener('keypress', function () {
		start();
		stop();
	});

	document.addEventListener('keyup', function (ev) {
		if (!self.editing) return;
		if (ev.keyCode == 27) self.editingDone();
	});


	var supportsPlaintext = supportsPlaintextEditables();

	// google chrome and other webkit browsers need this:
	// https://stackoverflow.com/questions/17890568/contenteditable-div-backspace-and-deleting-text-node-problems
	if (supportsPlaintext) {
		this.messageInput.contentEditable = "plaintext-only";
	}

	// hook up the autocomplete
	this.complete.re = /[@#](\w{1,15})$/; // TODO: customize the regexp
	this.complete.formatSelection = function (option) {
		if (supportsPlaintext) {
			// Google Chrome and other webkit browser
			return '<button class="ac" contenteditable="false" tabindex="-1" data-id="' + option.id + '">' + option.insert + '</button>';
		} else {
			// Firefox, IE
			return '<input type="button" class="ac" tabindex="-1" data-id="' + option.id + '" value="' + option.insert + '">';
		}
	};
	this.complete.query = function (matches) {
		var match = matches[0];
		console.log(match);

		// XXX: implement matching logic and populate with real results
		self.complete.clear();

		if (match[0] == "@") {
			// show users and rooms, we have them locally.
			// naive search: loop through all of them,
			// hopefully there are not too many


			var search = match.substr(1); // match without the '@''

			var users = app.organization.users;
			for (var i=0; i<users.length; i++) {
				var user = users[i];
				if (  user.firstName.startsWithIgnoreCase(search)
				   || user.lastName.startsWithIgnoreCase(search)
				   || user.username.startsWithIgnoreCase(search)) {
					self.complete.push({
						id: user.username,
						title: '<span class="entry-type-icon type-member">&nbsp;</span>@' + user.username + ': <img src="' + user.avatar + '" width="16" alt="Avatar of ' + user.firstName + ' ' + user.lastName + '" style="border-radius:50%;margin-bottom:-3px;"/>&nbsp;'+ user.firstName + ' ' + user.lastName + '<span class="entry-type-description">Member</span>',
						insert: '@' + user.username
					});
				}
			}

			var rooms = app.organization.rooms;
			for (var i=0; i<rooms.length; i++) {
				var room = rooms[i];
				if (room.name.startsWithIgnoreCase(search)) {
					self.complete.push({
						id: room.slug,
						title: '<span class="entry-type-icon type-room">&nbsp;</span>@' + room.name + '<span class="entry-type-description">Room</span>',
						insert: '@' + room.lastName
					});
				}
			}

			self.complete.show();
			self.complete.highlight(0);

		} else if (match[0] == "#") {
			// send autocomplete request to server, we don't have the data locally

			self.emit('autocomplete', match, function autocomplete_callback(err, result){
				console.log("autocomplete from server", err, result);
				for (var i=0; i<result.length; i++) {
					var r = result[0];

					self.complete.push({
						id: r["id"],
						title: '<span class="entry-type-icon type-' + r.service + r.type + '">&nbsp;</span>' + r.highlighted + ' <span class="entry-additional-info">in ubergrape/chatgrape</span><span class="entry-type-description">' + r.service + ' ' + r.type + '</span>',
						insert: r.complete
					})
				}

				// this should be shown at the beginning but
				// with a loading animation maybe?
				self.complete.show();
				self.complete.highlight(0);
			});
		}


	};
};

ChatInput.prototype.setRoom = function ChatInput_setRoom(room) {
	this.room = room;
	attr(this.messageInput).set('disabled', !room);
	if (room) this.messageInput.focus();
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
	this.oldVal = this.messageInput.innerHTML;
	this.messageInput.innerHTML = msg['text'];
	this.messageInput.focus();
	this.moveCaretToEnd(this.messageInput);
}

ChatInput.prototype.editingDone = function ChatInput_editingDone() {
	this.emit('editingdone', this.editMsg);
	this.editing = false;
	this.messageInput.innerHTML = this.oldVal;
	this.oldVal = null;
	this.editMsg = null;
	classes(this.el).remove('editing');
	this.messageInput.focus();
}

/*
ChatInput.prototype.addAttachment = function ChatInput_addAttachment(attachment) {
	this.attachments.push(attachment.id);
};
*/

function supportsPlaintextEditables() {
	var div = document.createElement('div');
	div.setAttribute('contenteditable', 'PLAINTEXT-ONLY');

	return div.contentEditable === 'plaintext-only';
}
