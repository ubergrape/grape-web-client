/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var settings = {
	websocket: 'ws://' + location.host
};

var template = require('template');

//var events = require('events');
var domify = require('domify');

exports.ItemList = require('./elements/itemlist');
var Navigation = exports.Navigation = require('./elements/navigation');
var RoomDialog = exports.RoomDialog = require('./elements/roomdialog');
var emitter = require('emitter');

var lib = require('../lib');
var App = lib.App;

var RoomView = require('./views/roomview');

function qs(s) {
	return document.querySelector(s);
}

function UI(app) {
	var self = this;

	// add the main layout to the dom
	document.body.appendChild(domify(template('index')));

	// add the navigation to the layout
	var sidebar = qs('.navigation');
	var navigation = this.navigation = new Navigation();
	sidebar.parentNode.replaceChild(navigation.el, sidebar);

	// initialize the add room dialog
	var addRoom = new RoomDialog();

	// set the items for the nav list
	var rooms = app.organization.rooms;
//	rooms = [
//		{id: 1, name: 'Design'},
//		{id: 2, name: 'Infrastruktur'},
//		{id: 3, name: 'Marketing'},
//		{id: 4, name: 'Privat', 'private': true, unread: 2}
//	].map(function (r) { r.joined = true; return emitter(r); });
//	rooms = emitter(rooms);
	var pms = app.organization.users;
//	var pms = [
//		{id: 1, username: 'Tobias Seiler', status: 16},
//		{id: 2, username: 'Leo Fasbender', status: 0},
//		{id: 3, username: 'Lea de Roucy', status: 16, unread: 1}
//	].map(function (r) { return emitter(r); });
//	pms = emitter(pms);
	var labels = [];// FIXME: add real labels
	labels = [
		{id: 1, name: '#github', icon: 'github'},
		{id: 2, name: '#entscheidungen', icon: 'check-circle'},
		{id: 3, name: '#termine', icon: 'calendar'},
	].map(function (r) { return emitter(r); });
	labels = emitter(labels);

	navigation.setLists({
		rooms: rooms,
		pms: pms,
		labels: labels
	});

	// set the items for the add room dialog
	addRoom.setRooms(rooms);

	// bind navigation events
	navigation.on('selectroom', function (room) {
		navigation.select('room', room);
		self.currentRoom = room;
		roomView.setRoom(room);
	});
	navigation.on('addroom', function () {
		addRoom.show();
	});
	// TODO: interaction of user list
	navigation.on('selectpm', function (/*pm*/) {
		console.log('TODO: implement pm change');
	});
	navigation.on('addpm', function () {
		console.log('TODO: implement new pm dialogue');
	});
	// TODO: interaction of label list
	navigation.on('selectlabel', function (/*label*/) {
		console.log('TODO: implement label change');
	});
	navigation.on('addlabel', function () {
		console.log('TODO: implement new label dialogue');
	});

	// bind the event to join a room
	addRoom.on('selectroom', function (room) {
		app.joinRoom(room);
	});

	// get all the elements
	this.userinfo = qs('.userinfo');
	this.conversations = qs('.conversations');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);

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
