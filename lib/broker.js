/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = doBroker;

function doBroker(ui, app) {
	broker(app, 'change organization', ui, 'setOrganization');
	broker(app, 'change organizations', ui, 'setOrganizations');
	broker(app, 'change user', ui, 'setUser');
	broker(app, 'change settings', ui, 'setSettings');
	broker(ui, 'selectorganization', app, 'setOrganization');

	broker(ui, 'joinroom', app, 'joinRoom');
	broker(ui, 'leaveroom', app, 'leaveRoom');
	broker(ui, 'createroom', app, 'createRoom');
	broker(ui, 'deleteroom', app, 'deleteRoom');
	broker(ui, 'openpm', app, 'openPM');
	broker(ui, 'input', app, 'publish');
	broker(ui, 'update', app, 'updateMsg');
	broker.pass(app, 'newmessage', ui, 'newmessage');

	ui.on('starttyping', function (room) {
		app.setTyping(room, true);
	});
	ui.on('stoptyping', function (room) {
		app.setTyping(room, false);
	});
	broker(ui, 'hasread', app, 'setRead');
	broker(ui, 'introend', app, 'endedIntro');
	broker(ui, 'timezonechange', app, 'changedTimezone');

	broker(ui, 'needhistory', app, 'getHistory');
	broker.pass(app, 'gothistory', ui, 'gothistory');
	broker.pass(app, 'nohistory', ui, 'nohistory');
	broker(ui, 'deletemessage', app, 'deleteMessage');
	broker(ui, 'invitetoroom', app, 'inviteToRoom');

	broker(ui, 'autocomplete', app, 'autocomplete');
	broker(ui, 'autocompletedate', app, 'autocompleteDate');
	broker(ui, 'searching', app, 'search');
	broker(app, 'gotsearchresults', ui, 'displaySearchResults');

	broker(app, 'roomcreated', ui, 'roomCreated');
	broker(app, 'roomdeleted', ui, 'roomDeleted');
	broker(ui, 'confirmroomrename', app, 'renameRoom');
	broker(app, 'error', ui, 'gotError');
	broker(app, 'roomcreateerror', ui, 'roomCreateError');
	broker.pass(app, 'roomrenameerror', ui, 'roomrenameerror');
	broker(app, 'leavechannel', ui, 'leaveChannel');
	broker(app, 'channelupdate', ui, 'channelUpdate');
	broker.pass(app, 'channelupdate', ui, 'channelupdate');

	broker(app, 'disconnected', ui, 'handleConnectionClosed');
	broker(app, 'connected', ui, 'handleReconnection');
	
	broker.pass(app, 'deleteduser', ui, 'deletedUser');
	broker.pass(app, 'new org member', ui, 'newOrgMember');
	broker.pass(app, 'newroom', ui, 'newRoom');
	broker.pass(app, 'roomdeleted', ui, 'roomDeleted');
}

