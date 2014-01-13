/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
/* global history: true */
"use strict";

var template = require('template');
template.root = '/cg/templates';

var inputarea = require('inputarea');
var domify = require('domify');
var Wamp = require('wamp1');

var URI = {
	MESSAGE: 'http://message'
};

var HOST = 'ws://' + location.host;

var history = document.querySelector('.history');

var wamp = new Wamp(HOST, function (welcome) {
	console.log(welcome);

	wamp.call('http://localhost:8000/calc#add', 1, 2, function (err, res) {
		console.log(arguments)
	});

	wamp.subscribe(URI.MESSAGE, function (message) {
		var el = domify(template('chatline', {
			time: new Date(),
			user: message.user,
			text: message.message
		}));
		history.appendChild(el);
	});

});
wamp.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('error', function () {
	console.log(arguments);
});

var input = document.querySelector('.input');

inputarea(input).on('input', function (str) {
	wamp.publish(URI.MESSAGE, {user: wamp.sessionId, message: str});
});
