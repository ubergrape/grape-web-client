/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var settings = {
	websocket: 'ws://' + location.host
};

var template = require('template');

//var events = require('events');
var domify = require('domify');

var RoomList = exports.RoomList = require('./elements/roomlist');


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
	var sidebar = qs('section.nav-lists');

	this.conversations = qs('.conversations');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);
	this.conversations.innerHTML = template('conversations', app.organization);

	// setup room list in sidebar
	var roomList = new RoomList();
	sidebar.insertBefore(roomList.el, sidebar.firstChild);

	function updateRoomList() {
		// TODO: only has the joined rooms for now
		roomList.setRooms(app.organization.rooms.filter(function (room) {
			room.unread = room.id
			return true || room.joined;
		}));
	}
	updateRoomList();

	// react to room changes
	function changedRoom(room) {
		roomList.changedRoom(room);
	}
	models.Room.on('change joined', changedRoom);
	models.Room.on('change unread', changedRoom);
	models.Room.on('change name', changedRoom);

	roomList.on('selectroom', function (room) {
		roomList.selectRoom(room);
		self.currentRoom = room;
		roomView.setRoom(room);
	});
	roomList.on('addroom', function () {
		console.log('TODO: implement room join dialogue');
	});

	// react to user changes
	// TODO: maybe this needs renaming, for now its the list of users
	models.User.on('change', function () {
		self.conversations.innerHTML = template('conversations', app.organization);
	});

	// bind to new message input
	var roomView = this.roomView = new RoomView(app);
	roomView.on('input', function (str) {
		app.publish(self.currentRoom, str);
	});
}

try {

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

} catch (e) {} // FIXME: restructure this
