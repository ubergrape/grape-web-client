/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var domify = require('domify');
var Emitter = require('emitter');
var broker = require('broker');
var qs = require('query');

var exports = module.exports = UI;

exports.ItemList = require('./elements/itemlist');
var Navigation = exports.Navigation = require('./elements/navigation');
var RoomDialog = exports.RoomDialog = require('./elements/roomdialog');
var ChatHeader = exports.ChatHeader = require('./elements/chatheader');
var ChatInput = exports.ChatInput = require('./elements/chatinput');
var RoomView = exports.RoomView = require('./views/roomview');

function UI() {
	Emitter.call(this);
	this.init();
	this.bind();
}

UI.prototype = Object.create(Emitter.prototype);

UI.prototype.init = function UI_init() {
	this.el = domify(template('index'));

	// add the navigation to the layout
	var sidebar = qs('.navigation', this.el);
	var navigation = this.navigation = new Navigation();
	sidebar.parentNode.replaceChild(navigation.el, sidebar);

	// initialize the add room dialog
	this.addRoom = new RoomDialog();

	// initialize the chat header
	this.chatHeader = new ChatHeader();
	qs('.client-room-info', this.el).appendChild(this.chatHeader.el);

	// initialize the input field
	this.chatInput = new ChatInput();
	qs('.input-wrapper', this.el).appendChild(this.chatInput.el);

	// FIXME: initialize the room view
	//this.roomView = new RoomView();
};

UI.prototype.bind = function UI_bind() {
	var navigation = this.navigation;
	var addRoom = this.addRoom;
	var self = this;
	this.room = null; // FIXME: there needs to be a better way? maybe set the room on the input?
	// bind navigation events
	navigation.on('selectroom', function (room) {
		self.room = room;
		navigation.select('room', room);
	});
	broker(navigation, 'addroom', addRoom, 'show');
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
	broker.pass(addRoom, 'selectroom', this, 'joinroom');

	// chat header/search functionality
	broker.pass(this.chatHeader, 'search', this, 'search');
	broker(navigation, 'selectroom', this.chatHeader, 'setRoom');

	// chat input
	broker(navigation, 'selectroom', this.chatInput, 'setRoom');
	broker.pass(this.chatInput, 'input', this, 'input');
	broker.pass(this.chatInput, 'starttyping', this, 'starttyping');
	broker.pass(this.chatInput, 'stoptyping', this, 'stoptyping');
};

UI.prototype.setOrganization = function UI_setOrganization(org /* FIXME: */, app) {
	// FIXME:
	this.roomView = new RoomView(this.el, app);
	broker(this.navigation, 'selectroom', this.roomView, 'setRoom');

	// set the items for the nav list
	var rooms = org.rooms;
//	rooms = [
//		{id: 1, name: 'Design'},
//		{id: 2, name: 'Infrastruktur'},
//		{id: 3, name: 'Marketing'},
//		{id: 4, name: 'Privat', 'private': true, unread: 2}
//	].map(function (r) { r.joined = true; return Emitter(r); });
//	rooms = Emitter(rooms);
	var pms = org.users;
//	var pms = [
//		{id: 1, username: 'Tobias Seiler', status: 16},
//		{id: 2, username: 'Leo Fasbender', status: 0},
//		{id: 3, username: 'Lea de Roucy', status: 16, unread: 1}
//	].map(function (r) { return Emitter(r); });
//	pms = Emitter(pms);
	var labels = [];// FIXME: add real labels
	labels = [
		{id: 1, name: '#github', icon: 'github'},
		{id: 2, name: '#entscheidungen', icon: 'check-circle'},
		{id: 3, name: '#termine', icon: 'calendar'},
	].map(function (r) { return new Emitter(r); });
	labels = new Emitter(labels);

	this.navigation.setLists({
		rooms: rooms,
		pms: pms,
		labels: labels
	});

	// set the items for the add room dialog
	this.addRoom.setRooms(rooms);
};

