/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
/* global history: true */
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

var App = require('../lib').App;

var history = document.querySelector('.history');
var input = document.querySelector('.input');

var app = window.app = new App(settings, function (err) {
	if (err)
		return console.log('error:', err);
	console.log(app);
	document.querySelector('.meta').innerHTML = template('meta', app);

	var room = app.rooms[0];

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

}); // App callback

// just some debugging for now, nothing more
var wamp = window.wamp = app.wamp;
wamp.socket.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('message', function (msg) {
	console.log('socket receive: ', JSON.parse(msg));
});
