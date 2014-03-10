/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var settings = {
	websocket: 'ws://' + location.host
};

var template = require('template');

//var events = require('events');
var domify = require('domify');

var ItemList = exports.ItemList = require('./elements/itemlist');


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
	var sidebar = qs('.navigation');

	this.conversations = qs('.conversations');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);

	// setup room list in sidebar
	var roomList = new ItemList({template: 'roomlist'});
	sidebar.appendChild(roomList.el);

	roomList.setItems(app.organization.rooms);

	// bind interaction
	roomList.on('selectitem', function (room) {
		roomList.selectItem(room);
		self.currentRoom = room;
		roomView.setRoom(room);
	});
	roomList.on('additem', function () {
		console.log('TODO: implement room join dialogue');
	});

	// setup the messages/conversation/user list in sidebar
	var pmList = new ItemList({template: 'pmlist', selector: '.item .name, .item .avatar, .item .unread'});
	sidebar.appendChild(pmList.el);

	pmList.setItems(app.organization.users);

	// TODO: interaction of user list
	pmList.on('selectitem', function (/*pm*/) {
		console.log('TODO: implement pm change');
	});
	pmList.on('additem', function () {
		console.log('TODO: implement new pm dialogue');
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
