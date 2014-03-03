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
var _ = require('t');
['de', 'en'].forEach(function (lang) {
	_.merge(lang, require('../locale/' + lang));
});
template.locals._ = _;

var events = require('events');
var domify = require('domify');


var lib = require('../lib');
var models = lib.models;
var App = lib.App;

var RoomView = require('./views/roomview');

function qs(s) {
	return document.querySelector(s);
}

function UI(app) {
	var self = this;

	// add the main layout to the dom
	document.body.appendChild(domify(template('index')));

	// get all the elements
	this.userinfo = qs('.userinfo');
	// TODO: maybe rename this var?
	this.rooms = qs('.rooms');
	this.conversations = qs('.conversations');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);
	this.conversations.innerHTML = template('conversations', app.organization);

	// react to room changes
	function drawRooms() {
		self.rooms.innerHTML = template('rooms', {
			rooms: app.organization.rooms,
			currentRoom: self.currentRoom
		});
	}
	models.Room.on('change joined', drawRooms);
	models.Room.on('change unread', drawRooms);
	models.Room.on('change name', drawRooms);

	function changeRoom(room) {
		self.currentRoom = room;
		roomView.setRoom(room);
		drawRooms();
	}
	var roomEvents = events(self.rooms, {
		join: function (ev) {
			var roomEl = ev.target;
			var id = roomEl.dataset.id;
			var room = models.Room.get(id);
			if (room.joined)
				return changeRoom(room);
			app.joinRoom(room, function () {
				changeRoom(room);
			});
		},
		leave: function (ev) {
			var roomEl = ev.target.parentNode;
			var id = roomEl.dataset.id;
			var room = models.Room.get(id);
			app.leaveRoom(room);

			// also change the room to the first open one in the UI:
			if (room !== self.currentRoom)
				return;
			var rooms = app.organization.rooms;
			for (var i = 0; i < rooms.length; i++) {
				var newRoom = rooms[i];
				if (newRoom.joined) {
					changeRoom(newRoom);
					break;
				}
			}
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
	var roomView = this.roomView = new RoomView(app);
	roomView.on('input', function (str) {
		app.publish(self.currentRoom, str);
	});

	//this.currentRoom = app.organization.rooms[0];
	//roomView.setRoom(this.currentRoom);
	drawRooms();
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
