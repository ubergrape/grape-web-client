/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var inputarea = require('inputarea');
var debounce = require('debounce');
var textcomplete = require('textcomplete');
var qs = require('query');
var closest = require('closest');
var style = require('computed-style');
var classes = require('classes');
var template = require('template');
var render = require('../rendervdom');
var attr = require('attr');
var isWebkit = require('../iswebkit');
var markdown_renderlink = require('../markdown_renderlink');
var renderAutocomplete = require('../renderautocomplete');
var staticurl = require('staticurl');
var emoji = require('../emoji');
var MarkdownTipsDialog = require('./dialogs/markdowntips');


require("startswith");

module.exports = ChatInput;

ChatInput.DELAY = 500;

function ChatInput() {
	Emitter.call(this);
	this.room = null;
	this.max_autocomplete = 12; // maximum of n items
	//this.attachments = [];
	this.init();
	this.bind();
}

ChatInput.prototype = Object.create(Emitter.prototype);

ChatInput.prototype.init = function ChatInput_init() {
	this.redraw();
	this.messageInput = qs('.messageInput', this.el);
	emoji.init_colons();
	this.markdowntipsdialog = new MarkdownTipsDialog().closable();
};

ChatInput.prototype.redraw = function ChatInput_redraw() {
	var vdom = template('chatinput', {});
	render(this, vdom);
};

ChatInput.prototype.bind = function ChatInput_bind() {
	var self = this;

	//bind markdown info
	this.events = events(this.el, this);
	this.events.obj.toggleMarkdownTips = this.toggleMarkdownTips.bind(this);
	this.events.bind('click .markdown-tips', 'toggleMarkdownTips');

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
	this.input.cleanedValue = function() {
		var el = this.el;
		var children = [];
		for(var child in el.childNodes) {
			var childnode = el.childNodes[child];
			// check if it is a google content. If so, un wrap it from the wrapping <ol>
			// then process the content normally
			if(childnode.nodeName === "OL" && typeof childnode.childNodes !== 'undefined'
			&& childnode.childNodes.length == 1){
				childnode = childnode.childNodes[0];
			}
			// check if there are some contents in wrapped in a big <div>. If so, handle
			// the inner contents 
			// else, clean the current elment
			if(childnode.childNodes && childnode.childNodes.length > 1){
				// check if it is not an emoji or autocomplete item. If so, don't split the elment
				// as the autocomplete item will be lost, else, continue normally
				if(childnode.nodeType === 1 && childnode.getAttribute('data-object') !== null){
					children = children.concat(self.cleanNode(childnode));
				} else{
					for(var subchild in childnode.childNodes){
					children = children.concat(self.cleanNode(childnode.childNodes[subchild]));
					}
				}

			} else{
				children = children.concat(self.cleanNode(childnode));
			}
		}
		return children.join('');
	};
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
		if (ev.keyCode === 27) self.editingDone();
	});

	// google chrome and other webkit browsers need this:
	// https://stackoverflow.com/questions/17890568/contenteditable-div-backspace-and-deleting-text-node-problems
	if (isWebkit()) {
		this.messageInput.contentEditable = "plaintext-only";
	}

	// hook up the autocomplete
	// there should always be a whitespace char in front, or beginning of line. hence (?:^|\s)
	this.complete.re = /(?:^|\s)[@#:]([^\s]{1,15})$/;
	this.complete.formatSelection = function (obj) {
		return renderAutocomplete(obj, true);
	};
	this.complete.query = function (matches) {
		var match = matches[0];

		self.complete.clear();

		if (match[0] == ':') {
			var search;
			if (match[match.length-1] === ':')
				// match without ':' at the beginning and at the end
				search = match.substr(1, match.length-1);
			else {
				// match without ':' at the beginning
				search = match.substr(1);
			}

			search = search.toLowerCase();

			// TODO: app.organization
			var custom_emojis = app.organization.custom_emojis;
			for (var emo in custom_emojis) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				if (custom_emojis.hasOwnProperty(emo)) {
					if (~emo.indexOf(search)) {
						var image = '<img src="'+custom_emojis[emo]+'" class="emoji" alt="'+emo+'">';
						self.complete.push({
							id: ":" + emo + ":",
							title: "<div class='entry-type-description'>Emoji</div>" + "<div class='option-wrap'>" + image + " :" + emo + ":" + "</div>",
							insert: image,
							service: "emoji",
							type: "emoji"
						});
					}
				}

			}

			var emojis = emoji.map.colons;
			for (var emo in emojis) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				if (emojis.hasOwnProperty(emo)) {
					var val = emojis[emo];
					if (~emo.indexOf(search)) {
						var image = emoji.replacement(val, emo, ':');
						self.complete.push({
							id: ":" + emo + ":",
							title: "<div class='entry-type-description'>Emoji</div>" + "<div class='option-wrap'>" + image + " :" + emo + ":" + "</div>",
							insert: image,
							service: "emoji",
							type: "emoji"
						});
					}
				}
			}

			if (self.complete.options.length > 0) {
				self.complete.show();
				self.complete.highlight(0);
			}

		} else if (match[0] == "@") {
			// show users and rooms, we have them locally.
			// naive search: loop through all of them,
			// hopefully there are not too many

			var search = match.substr(1); // match without the '@'

			// TODO don't use global vars

			var users = app.organization.users;
			for (var i=0; i<users.length; i++) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				var user = users[i];
				if (  user.firstName.startsWithIgnoreCase(search)
				   || user.lastName.startsWithIgnoreCase(search)
				   || user.username.startsWithIgnoreCase(search)) {
					var name = "";
					var full_name_class = "";
					if (user.firstName !== "") {
						name += user.firstName;
						if (user.lastName !== "") {
							name += " " + user.lastName;
						}
						full_name_class = "full_name_true";
					} else {
						name = user.username;
						full_name_class = "full_name_false";
					}

					self.complete.push({
						id: "[" + name + "](cg://chatgrape|user|" + user.id + "|/chat/@" + user.username + ")",
						title: '<div class="entry-type-description">Member</div>' + '<div class="option-wrap ' + full_name_class +'">' + '<img src="' + user.avatar + '" width="16" alt="Avatar of ' + user.firstName + ' ' + user.lastName + '" style="border-radius:50%;margin-bottom:-3px;"/>&nbsp;' + user.firstName + ' ' + user.lastName + ' <em>' + user.username + '</em></div>',
						insert: '@' + name,
						service: 'chatgrape',
						type: 'user',
						url: '/chat/@' + user.username
					});
				}
			}

			var rooms = app.organization.rooms;
			for (var i=0; i<rooms.length; i++) {
				if (self.complete.options.length >= self.max_autocomplete)
					break;
				var room = rooms[i];
				if (room.name.startsWithIgnoreCase(search)) {
					self.complete.push({
						id: "[" + room.name + "](cg://chatgrape|room|" + room.id + "|/chat/" + room.slug + ")",
						title: '<div class="entry-type-description">Room</div>' + '<div class="option-wrap"><span class="entry-type-icon type-chatgraperoom"></span> ' + room.name + '</div>',
						insert: '@' + room.name,
						service: 'chatgrape',
						type: 'room',
						url: '/chat/' + room.name
					});
				}
			}

			if (self.complete.options.length > 0) {
				self.complete.show();
				self.complete.highlight(0);
			}


		} else if (match[0] === "#") {
			// send autocomplete request to server, we don't have the data locally

			self.emit('autocomplete', match, function autocomplete_callback(err, result){
				for (var i=0; i<result.length; i++) {
					if (self.complete.options.length >= self.max_autocomplete)
						break;
					var r = result[i];
					self.complete.push({
						id: "[" + r.name + "](cg://" + r.service + "|" + r.type + "|" + r.id + "|" + r.url + "||)",
						title: '<div class="entry-type-description">' + r.service + ' ' + r.type + '</div>' + '<div class="option-wrap"><span class="entry-type-icon service-' + r.service + ' type-' + r.service + r.type +'"></span>' + r.highlighted + ' <em class="entry-additional-info">' + r.container + '</em></div>',
						insert: r.name,
						service: r.service,
						type: r.type,
						url: r.url
					});
				}

				if (self.complete.options.length > 0) {
					self.complete.show();
					self.complete.highlight(0);
				}
			});
		}


	};
};

ChatInput.prototype.setRoom = function ChatInput_setRoom(room) {
	this.room = room;
	attr(this.messageInput).set('disabled', !room);
	if (room) this.messageInput.removeAttribute('disabled'); // IE :)
	if (room) this.messageInput.focus();
	if (this.editing)
		this.editingDone();
};

ChatInput.prototype.moveCaretToEnd = function ChatInput_moveCaretToEnd(el) {
	el.focus();
	if (typeof window.getSelection !== "undefined"
			&& typeof document.createRange !== "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange !== "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
};

ChatInput.prototype.editMessage = function ChatInput_editMessage(msg) {
	this.editMsg = msg;
	this.editing = true;
	classes(this.el).add('editing');
	this.oldVal = this.messageInput.innerHTML;
	var message_text = msg.text;

	// replace special autocomplete links with html
	var autocomplete = /\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*(cg\:[\s\S]*?)\s*\)/gm;
	var replacer = function replacer(match, text, href){
		return markdown_renderlink(href, "", text, true);
	};
	message_text = message_text.replace(autocomplete, replacer);

	// replace linebreaks with <br>s
	message_text = message_text.replace(/\n/gm, "<br>");

	this.messageInput.innerHTML = message_text;
	this.messageInput.focus();
	this.moveCaretToEnd(this.messageInput);
};

ChatInput.prototype.editingDone = function ChatInput_editingDone() {
	this.emit('editingdone', this.editMsg);
	this.editing = false;
	this.messageInput.innerHTML = this.oldVal;
	this.oldVal = null;
	this.editMsg = null;
	classes(this.el).remove('editing');
	this.messageInput.focus();
};

ChatInput.prototype.cleanNode = function ChatInput_cleanNode(childnode) {
	// clean an input element
	var children = [];
	// check if the element is any thing other than text and objects, e.g. iterator function
	if(typeof childnode.nodeName === 'undefined' && typeof childnode.nodeType === 'undefined'){
		return[];
	}
	// if the elment is one of the following tags, insert new line
	if(childnode.nodeName && (childnode.nodeName === "BR" 
	|| childnode.nodeName === "DIV" || childnode.nodeName === "P"
	|| childnode.nodeName === "LI" || childnode.nodeName === "UL")){
		children.push("\n");
	}
	if (childnode.nodeType === 3) {
		children.push(childnode.nodeValue);
	} else if (childnode.nodeType === 1) {
		// we don't use attr() here because it loops through all
		// attributes when it doesn't find the attribute with
		// getAttribute. So this won't work in old IEs, but it's faster
		var object = childnode.getAttribute('data-object');
		if (object !== null) {
			children.push(object);
		} else {
			// Q: why would there be any HTML in the message input?
			// A: pasting content
			children.push(childnode.textContent);
		}
	} else if (childnode.textContent){
		children.push(childnode.textContent);
	} else if(childnode.nodeName === "IMG"){
		children.push("[IMG]\n");
		children.push(childnode.src);
	} 
	return children;
};

/*
ChatInput.prototype.addAttachment = function ChatInput_addAttachment(attachment) {
	this.attachments.push(attachment.id);
};
*/

ChatInput.prototype.toggleMarkdownTips = function ChatInput_toggleMarkdownTips(ev) {
	ev.preventDefault();
	this.markdowntipsdialog.overlay().show();
}
