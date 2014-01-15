/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
//var Cache = require('model-cache');
var array = require('array');
var adapter = require('../adapter');

module.exports = new Model(['name'])
	//.use(Cache('pk'))
	.use(children)
	.use(adapter('http://cg.api/rooms/', handleEvent)); // move the uri to some central config

// Adds `history` and `users` properties as interactive arrays
function children(Model) {
	Model.on('construct', function (instance) {
		instance.history = array();
		instance.users = array();
	});
}

function handleEvent(instance, msg) {
	if (msg.type === 'message') {
		instance.history.push(msg.message);
	} else
		console.log('unhandled', msg);
}
