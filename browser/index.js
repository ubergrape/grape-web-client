/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var settings = {
	websocket: 'ws://' + location.host
};

var template = require('template');

//var events = require('events');
var domify = require('domify');

var ItemList = exports.ItemList = require('./elements/itemlist');
var emitter = require('emitter');

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
	new (require('scrollbars'))(sidebar);
	this.conversations = qs('.conversations');

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);

	// setup room list in sidebar
	var roomList = new ItemList({template: 'roomlist'});
	sidebar.appendChild(roomList.el);

//	var fakeRooms = [
//		{id: 1, name: 'Design'},
//		{id: 2, name: 'Infrastruktur'},
//		{id: 3, name: 'Marketing'},
//		{id: 4, name: 'Privat', 'private': true, unread: 2}
//	].map(function (r) { r.joined = true; return emitter(r); });
//	roomList.setItems(emitter(fakeRooms));
//	roomList.selectItem(fakeRooms[0]);
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

//	var fakePms = [
//		{id: 1, username: 'Tobias Seiler', status: 16},
//		{id: 2, username: 'Leo Fasbender', status: 0},
//		{id: 3, username: 'Lea de Roucy', status: 16, unread: 1}
//	].map(function (r) { return emitter(r); });
//	pmList.setItems(emitter(fakePms));
	pmList.setItems(app.organization.users);

	// TODO: interaction of user list
	pmList.on('selectitem', function (/*pm*/) {
		console.log('TODO: implement pm change');
	});
	pmList.on('additem', function () {
		console.log('TODO: implement new pm dialogue');
	});

	// setup label list in sidebar
	var labelList = new ItemList({template: 'labellist', selector: '.item .label'});
	sidebar.appendChild(labelList.el);

	var fakeLabels = [
		{id: 1, name: '#github', icon: 'github'},
		{id: 2, name: '#entscheidungen', icon: 'check-circle'},
		{id: 3, name: '#termine', icon: 'calendar'},
	].map(function (r) { return emitter(r); });
	labelList.setItems(emitter(fakeLabels));
	// TODO: real label list?
	//labelList.setItems();

	// TODO: interaction of label list
	labelList.on('selectitem', function (/*label*/) {
		console.log('TODO: implement label change');
	});
	labelList.on('additem', function () {
		console.log('TODO: implement new label dialogue');
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
