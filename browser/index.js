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

	// render the data
	this.userinfo.innerHTML = template('userinfo', app);
	this.rooms.innerHTML = template('rooms', app.organization);
	this.conversations.innerHTML = template('conversations', app.organization);

	// react to user changes
	// TODO: maybe this needs renaming, for now its the list of users
	models.User.on('change', function () {
		self.messages.innerHTML = template('messages', app);
	});

	// bind the room
	var room = app.organization.rooms[0];

	this.roomname.innerHTML = room.name;

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
	app.setOrganization(app.organizations[0], function (err, org) {
		app.subscribeRoom(app.organization.rooms[0]);
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
