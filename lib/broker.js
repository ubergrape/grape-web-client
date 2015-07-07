/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = doBroker;

function doBroker(ui, app) {
	broker(app, 'change organization', ui, 'setOrganization');
	broker(app, 'change organizations', ui, 'setOrganizations');
	broker(app, 'change user', ui, 'setUser');
	broker(app, 'change settings', ui, 'setSettings');
	broker(app, 'leftChannel', ui, 'leftChannel');
	broker(app, 'gotsearchresults', ui, 'displaySearchResults');
	broker(app, 'roomcreated', ui, 'roomCreated');
	broker(app, 'roomdeleted', ui, 'roomDeleted');
	broker(app, 'error', ui, 'gotError');
	broker(app, 'messageNotFound', ui, 'onMessageNotFound');
	broker(app, 'channelupdate', ui, 'channelUpdate');
	broker(app, 'disconnected', ui, 'handleConnectionClosed');
	broker(app, 'connected', ui, 'handleReconnection');

	broker(ui, 'selectorganization', app, 'setOrganization');
	broker(ui, 'setNotificationsSession', app, 'onSetNotificationsSession');
	broker(ui, 'kickMember', app, 'onKickMember');
	broker(ui, 'joinroom', app, 'joinRoom');
	broker(ui, 'leaveroom', app, 'leaveRoom');
	broker(ui, 'createroom', app, 'createRoom');
	broker(ui, 'deleteroom', app, 'deleteRoom');
	broker(ui, 'openpm', app, 'openPM');
	broker(ui, 'send', app, 'publish');
	broker(ui, 'update', app, 'updateMsg');
	broker(ui, 'hasread', app, 'setRead');
	broker(ui, 'introend', app, 'endedIntro');
	broker(ui, 'timezonechange', app, 'changedTimezone');
	broker(ui, 'needhistory', app, 'getHistory');
	broker(ui, 'requestMessage', app, 'onRequestMessage');
	broker(ui, 'loadHistoryForSearch', app, 'onLoadHistoryForSearch');
	broker(ui, 'autocomplete', app, 'autocomplete');
	broker(ui, 'autocompletedate', app, 'autocompleteDate');
	broker(ui, 'searching', app, 'search');
	broker(ui, 'confirmroomrename', app, 'renameRoom');
	broker(ui, 'deleteMessage', app, 'onDeleteMessage');
	broker(ui, 'invitetoroom', app, 'inviteToRoom');

	broker.pass(app, 'newMessage', ui, 'newMessage');
	broker.pass(app, 'newMsgNotification', ui, 'newMsgNotification');
	broker.pass(app, 'newInviteNotification', ui, 'newInviteNotification');
	broker.pass(app, 'channelRead', ui, 'channelRead');
	broker.pass(app, 'userMention', ui, 'userMention');
	broker.pass(app, 'newPMOpened', ui, 'newPMOpened');
	broker.pass(app, 'change user', ui, 'change user');
	broker.pass(app, 'joinedChannel', ui, 'joinedChannel');
	broker.pass(app, 'leftChannel', ui, 'leftChannel');
	broker.pass(app, 'newRoomMember', ui, 'newRoomMember');
	broker.pass(app, 'memberLeftChannel', ui, 'memberLeftChannel');
	broker.pass(app, 'focusMessage', ui, 'focusMessage');
	broker.pass(app, 'gotHistory', ui, 'gotHistory');
	broker.pass(app, 'nohistory', ui, 'nohistory');
	broker.pass(app, 'roomrenameerror', ui, 'roomrenameerror');
	broker.pass(app, 'roomcreateerror', ui, 'roomcreateerror');
	broker.pass(app, 'channelupdate', ui, 'channelupdate');
	broker.pass(app, 'userDeleted', ui, 'userDeleted');
	broker.pass(app, 'new org member', ui, 'new org member');
	broker.pass(app, 'newRoom', ui, 'newRoom');
	broker.pass(app, 'roomdeleted', ui, 'roomdeleted');

	ui.on('starttyping', function (room) {
		app.setTyping(room, true);
	});
	ui.on('stoptyping', function (room) {
		app.setTyping(room, false);
	});
}

