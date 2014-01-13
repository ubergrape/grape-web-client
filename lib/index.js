/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
/* global history: true */
"use strict";

var template = require('template');
template.root = '/cg/templates';

var inputarea = require('inputarea');
var domify = require('domify');
var Wamp = require('wamp1');


var wamp = new Wamp('ws://' + location.host, function (welcome) {
	console.log(welcome);
});
wamp.on('error', function () {
	console.log(arguments);
});
wamp.socket.on('error', function () {
	console.log(arguments);
});

var input = document.querySelector('.input');
var history = document.querySelector('.history');

inputarea(input).on('input', function (str) {
	console.log(str);
	wamp.publish('http://message', str);
	var el = domify(template('chatline', {
		time: new Date(),
		user: 'me :-)',
		text: str
	}));
	history.appendChild(el);
});
