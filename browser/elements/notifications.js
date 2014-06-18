/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var notify = require('HTML5-Desktop-Notifications');

module.exports = Notifications;

function Notifications() {
	this.org = {rooms: new Emitter([]), pms: new Emitter([])};
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

Notifications.prototype.newMessage = function Notifications_newMessage(message, self) {
	// don't show chat messages from myself
	if (message.author == ui.user) return;

	// don't show chat messages in current room, when focused
	if (message.channel == self.room.id && document.hasFocus()) return;

	// otherwise, show all chat messages

	//TODO: move this to user model
	var authorname = "";
	if (message.author.firstName != "") {
		authorname = message.author.firstName + " " + message.author.lastName;
	} else {
		authorname = message.author.username;
	}

	notify.createNotification(authorname, {
		body: message.text,
		icon: message.author.avatar,
		timeout: 6000
	});
};

Notifications.prototype.setOrganization = function Notifications_setOrganization(org) {
	var self = this;

	function addRoom(room) {
		room.history.on('add', newMessage);
	}

	function removeRoom(room) {
		room.history.off('add', newMessage);
	}

	function newMessage(message) {
		self.newMessage(message, self);
	}

	this.org.rooms.off('add', addRoom);
	this.org.rooms.off('remove', removeRoom);
	this.org.pms.off('add', addRoom);
	this.org.pms.off('remove', removeRoom);
	this.org = org;
	this.org.rooms.on('add', addRoom, self);
	this.org.rooms.on('remove', removeRoom);
	this.org.pms.on('add', addRoom);
	this.org.pms.on('remove', removeRoom);
};

function isDocumentHidden() {
	return document.hidden || document.msHidden || document.mozHidden || document.webkitHidden;
}