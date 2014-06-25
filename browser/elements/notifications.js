/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var notify = require('HTML5-Desktop-Notifications');

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
	var room;
    for (var i=0; i<app.organization.rooms.length; i++){
        if (app.organization.rooms[i].id == message.channel) {
            room = app.organization.rooms[i];
            break;
        }
    }
	if (typeof room !== 'undefined') {
		title += " (" + room.name + ")";
	}

	notify.createNotification(title, {
		body: message.text,
		icon: message.author.avatar,
		timeout: 6000
	});
};

// function isDocumentHidden() {
// 	return document.hidden || document.msHidden || document.mozHidden || document.webkitHidden;
// }