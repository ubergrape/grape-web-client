/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var notify = require('HTML5-Desktop-Notifications');
var _ = require('t');
var markdown = require('../markdown');
var v = require('virtualdom');
var domify = require('domify');


module.exports = Notifications;

function Notifications() {
	this.show = false;
	this.room = new Emitter({name: '', users: []});
	this.init();
	this.bind();
}

Notifications.prototype = Object.create(Emitter.prototype);

Notifications.prototype.init = function Notifications_init() {
	notify.config({
		pageVisibility: true,
		autoClose: 6000
	});
};

Notifications.prototype.bind = function Notifications_bind() {
	// nothing yet
};

Notifications.prototype.setRoom = function Notifications_setRoom(room) {
	this.room = room;
};

Notifications.prototype.newMessage = function Notifications_newMessage(message) {
	var self = this;

	// don't show chat messages from myself
	if (message.author == ui.user) return;

	// only show messages from joined rooms
	if (!message.channel.joined) return;

	// don't show chat messages in current room, when focused
	if (message.channel.id == self.room.id && document.hasFocus()) return;

	// otherwise, show all chat messages

	//TODO: move this to user model
	var authorname = "";
	if (message.author.firstName !== "") {
		authorname = message.author.firstName + " " + message.author.lastName;
	} else {
		authorname = message.author.username;
	}

	// add room name to title
	var title = authorname;

	if (message.channel.type == "room") {
		title += " (" + message.channel.name + ")";
	} else {
		title += " (" + _('Private Message') + ")";
	}

	// parse markdown
	var content = message.text;
	var content_dom = domify(markdown(content))

	// replace images
	var imgs = content_dom.getElementsByTagName('img');
	var replacement = document.createElement("p");
	replacement.innerHTML = _('[Image]');
	for (var i=0; i<imgs.length; i++) {
		var img = imgs[i];
		img.parentElement.replaceChild(replacement, img);
	}

	// strip html
	var content_text = content_dom.textContent || content_dom.innerText || "";

	var notification = notify.createNotification(title, {
		body: content_text,
		icon: message.author.avatar,
		timeout: 6000,
		onclick: function(ev) {
			console.log()
			self.emit('notificationclicked', message.channel);
			window.focus();
			notification.close();
		}
	});
};

// function isDocumentHidden() {
// 	return document.hidden || document.msHidden || document.mozHidden || document.webkitHidden;
// }