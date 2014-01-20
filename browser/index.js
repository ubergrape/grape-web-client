/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
/* global history: true */
"use strict";

/**
 * Only browser and DOM specific code should go in this directory.
 * All the DOM independent code should be in lib/, which should be well tested
 * and has code coverage reports.
 */
var lib = require('../lib');

var template = require('template');
template.root = '/cg/templates';

var inputarea = require('inputarea');
var domify = require('domify');

var Room = lib.models.Room;
var wamp = window.wamp = lib.wamp;

var room = new Room({id: 1});

var history = document.querySelector('.history');

// just some debugging for now, nothing more
wamp.socket.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('message', function (msg) {
	console.log(msg);
});

wamp.call('http://localhost:8000/calc#add', 1, 2, function (err, res) {
	console.log(err, res);
});

room.history.on('add', function (line, i) {
	console.log(line);
	var oldEl;
	function redraw() {
		var el = domify(template('chatline', line));
		console.log(el, oldEl);
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
// test with:
// wamp.publish('http://cg.api/rooms/1', {type: 'reading', user: wamp.sessionId, line: 0});


var input = document.querySelector('.input');

inputarea(input).on('input', function (str) {
	room.publish(str);
	//wamp.publish(URI.MESSAGE, {user: wamp.sessionId, message: str});
});
