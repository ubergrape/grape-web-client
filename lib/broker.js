/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

exports.broker = doBroker;

function doBroker(ui, app) {
	broker(ui, 'joinroom', app, 'joinRoom');
	broker(ui, 'input', app, 'publish');
	ui.on('starttyping', function (room) {
		app.setTyping(room, true);
	});
	ui.on('stoptyping', function (room) {
		app.setTyping(room, false);
	});
	broker(ui, 'hasread', app, 'setRead');
	ui.on('needhistory', function (room, options) {
		app.getHistory(room, options, function (lines) {
			ui.gotHistory(room, lines);
		});
	});
	broker(ui, 'needhistory', app, 'getHistory');
}

