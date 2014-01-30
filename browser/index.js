/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

/**
 * Only browser and DOM specific code should go in this directory.
 * All the DOM independent code should be in lib/, which should be well tested
 * and has code coverage reports.
 */

var settings = {
	websocket: 'ws://' + location.host
};

var template = require('template');
template.root = '/cg/templates';
template.locals.strftime = require('strftime');

var inputarea = require('inputarea');
var domify = require('domify');
var events = require('events');

var lib = require('../lib');
var models = lib.models;
var App = lib.App;

function qs(s) {
	return document.querySelector(s);
}

function UI(app) {
	var self = this;
	// get all the elements
	this.userinfo = qs('.userinfo');
	this.rooms = qs('.rooms');
	this.conversations = qs('.conversations');
	var history = this.history = qs('.chathistory');
	var input = this.input = qs('.input');
	this.roomname = qs('.roomname');
	this.usersonline = qs('.usersonline');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);
	this.conversations.innerHTML = template('conversations', app.organization);

	// react to room changes
	function drawRooms() {
		self.rooms.innerHTML = template('rooms', app.organization);
	}
	drawRooms();
	models.Room.on('change joined', drawRooms);
	var roomEvents = events(self.rooms, {
		join: function (ev) {
			var roomEl = ev.target;
			var id = roomEl.dataset.id;
			var room = models.Room.get(id);
			app.joinRoom(room);
		},
		leave: function (ev) {
			var roomEl = ev.target.parentNode;
			var id = roomEl.dataset.id;
			var room = models.Room.get(id);
			app.leaveRoom(room);
		}
	});
	roomEvents.bind('click li', 'join');
	roomEvents.bind('click .leave', 'leave');

	// react to user changes
	// TODO: maybe this needs renaming, for now its the list of users
	models.User.on('change', function () {
		self.conversations.innerHTML = template('conversations', app.organization);
	});

	// bind the room
	// TODO: we would need a separate class `RoomView` or something like that
	// which would encapsulate this and have a methed to change the underlying
	// model
	var room = app.organization.rooms[0];

	this.roomname.innerHTML = room.name;
	function drawRoomUsers() {
		self.usersonline.innerHTML = template('roommeta', room);
	}
	drawRoomUsers();
	room.on('change users', drawRoomUsers);

	room.history.on('add', function (line) {
		var oldEl;
		function redraw() {
			var el = domify(template('chatline', line));
			if (oldEl) {
				history.replaceChild(el, oldEl);
			} else {
				history.appendChild(el);
			}
			oldEl = el;
		}
		redraw();
		line.readers.on('add', redraw);
		line.readers.on('remove', redraw);
	});

	inputarea(input).on('input', function (str) {
		if (!str)
			return;
		app.publish(room, str);
	});
}

var app = window.app = new App(settings, function (err) {
	if (err)
		return console.log('error:', err);
	app.setOrganization(app.organizations[0], function (err) {
		if (err)
			return console.log('error:', err);
		app.subscribeRooms();
		console.log(app);
		window.ui = new UI(app);
	});
});

// just some debugging for now, nothing more
var wamp = window.wamp = app.wamp;
wamp.socket.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('message', function (msg) {
	console.log('socket receive: ', JSON.parse(msg));
});
