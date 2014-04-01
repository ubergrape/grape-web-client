/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = doBroker;

function doBroker(ui, app) {
	broker(app, 'change organization', ui, 'setOrganization');
	broker(app, 'change organizations', ui, 'setOrganizations');
	broker(app, 'change user', ui, 'setUser');
	broker(ui, 'selectorganization', app, 'setOrganization');

	broker(ui, 'joinroom', app, 'joinRoom');
	broker(ui, 'leaveroom', app, 'leaveRoom');
	broker(ui, 'createroom', app, 'createRoom');
	broker(ui, 'openpm', app, 'openPM');
	broker(ui, 'input', app, 'publish');
	ui.on('starttyping', function (room) {
		app.setTyping(room, true);
	});
	ui.on('stoptyping', function (room) {
		app.setTyping(room, false);
	});
	broker(ui, 'hasread', app, 'setRead');

	broker(ui, 'needhistory', app, 'getHistory');
	broker(app, 'gothistory', ui, 'gotHistory');

	broker(app, 'roomcreated', ui, 'roomCreated');
}

