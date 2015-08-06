/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');

module.exports = Title;

function Title() {
	this.org = {rooms: new Emitter([]), pms: new Emitter([])};
	this.room = new Emitter({name: '', users: []});

	this.refresh = this.refresh.bind(this);
	this.addRoom = this.addRoom.bind(this);
	this.removeRoom = this.removeRoom.bind(this);
}

Title.prototype.refresh = function Title_refresh() {
	var title = '';

	var unread = this.org.rooms.reduce(sum, 0) +
	             this.org.pms.reduce(sum, 0);

	if (typeof MacGap !== "undefined") {
		if (unread) {
			MacGap.Dock.addBadge(unread);
		} else {
			MacGap.Dock.removeBadge();
		}
	}

	if (unread)
		if (unread > 99 && unread <= 400)
			title += '(99+) ';
		else if (unread > 400)
			title += '(∞) ';
		else
			title += '(' + unread + ') ';

	var name = this.room.name;
	if (!name) {
		var user = this.room.users[0];
		if (user)
			name = '@' + user.username;
	}
	if (name)
		title += name + ' – ';

	document.title = title + 'ChatGrape';
};

function sum(s, el) {
	if (!el.joined) return s;
	return s + el.unread;
}

Title.prototype.setRoom = function Title_setRoom(room) {
	this.room = room;
	this.refresh();
};

Title.prototype.addRoom = function Title_addRoom(room) {
	room.on('change', this.refresh);
	this.refresh();
};
Title.prototype.removeRoom = function Title_removeRoom(room) {
	room.off('change', this.refresh);
	this.refresh();
};

Title.prototype.setOrganization = function Title_setOrganization(org) {
	this.org.rooms.off('add', this.addRoom);
	this.org.rooms.off('remove', this.removeRoom);
	this.org.pms.off('add', this.addRoom);
	this.org.pms.off('remove', this.removeRoom);
	this.org = org;
	this.org.rooms.on('add', this.addRoom);
	this.org.rooms.on('remove', this.removeRoom);
	this.org.pms.on('add', this.addRoom);
	this.org.pms.on('remove', this.removeRoom);
};
