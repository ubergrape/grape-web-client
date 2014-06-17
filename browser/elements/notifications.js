/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var notify = require('HTML5-Desktop-Notifications');
var staticurl = require('../../lib/staticurl');

module.exports = Notifications;

function Notifications() {
	this.room = null;
	this.init();
	this.bind();
}

Notifications.prototype = Object.create(Emitter.prototype);

Notifications.prototype.init = function Notifications_init() {
	notify.config({
		pageVisibility: true,
		autoclose: 1000
	});
};

Notifications.prototype.bind = function Notifications_bind() {
	// nothing yet
};

Notifications.prototype.setRoom = function Notifications_setRoom(room) {
	// if (this.room) {
	// 	this.room.history.off('add', this.newMessage);
	// }
	this.room = room;
	room.history.on('add', this.newMessage);
};

Notifications.prototype.newMessage = function Notifications_newMessage(message) {
	console.log(notify);
	console.log(notify.isDocumentHidden());
	//TODO: move this to user model
	var authorname = ""
	if (message.author.firstName != "") {
		authorname = message.author.firstName + " " + message.author.lastName;
	} else {
		authorname = message.author.username;
	}
	var n = notify.createNotification(authorname, {
		body: message.text,
		icon: staticurl("images/brand-assets/chatgrape-grape-onwhite.png"),
		timeout: 1000
	});
};
