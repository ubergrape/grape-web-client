/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = doBroker;

function doBroker(ui, api) {
    broker(api, 'change organization', ui, 'setOrganization');
    broker(api, 'change organizations', ui, 'setOrganizations');
    broker(api, 'changeUser', ui, 'setUser');
    broker(api, 'change settings', ui, 'setSettings');
    broker(api, 'leftChannel', ui, 'leftChannel');
    broker(api, 'gotsearchresults', ui, 'displaySearchResults');
    broker(api, 'roomCreated', ui, 'roomCreated');
    broker(api, 'roomdeleted', ui, 'roomDeleted');
    broker(api, 'error', ui, 'gotError');
    broker(api, 'messageNotFound', ui, 'onMessageNotFound');
    broker(api, 'channelupdate', ui, 'channelUpdate');
    broker(api, 'disconnected', ui, 'onDisconnected');
    broker(api, 'connected', ui, 'onConnected');

    broker(ui, 'selectorganization', api, 'setOrganization');
    broker(ui, 'setNotificationsSession', api, 'onSetNotificationsSession');
    broker(ui, 'kickMember', api, 'onKickMember');
    broker(ui, 'joinroom', api, 'joinRoom');
    broker(ui, 'leaveRoom', api, 'onLeaveRoom');
    broker(ui, 'createRoom', api, 'onCreateRoom');
    broker(ui, 'deleteroom', api, 'deleteRoom');
    broker(ui, 'openpm', api, 'openPM');
    broker(ui, 'send', api, 'publish');
    broker(ui, 'update', api, 'updateMsg');
    broker(ui, 'hasread', api, 'setRead');
    broker(ui, 'introend', api, 'endedIntro');
    broker(ui, 'timezonechange', api, 'changedTimezone');
    broker(ui, 'editView', api, 'onEditView');
    broker(ui, 'needhistory', api, 'getHistory');
    broker(ui, 'requestMessage', api, 'onRequestMessage');
    broker(ui, 'loadHistoryForSearch', api, 'onLoadHistoryForSearch');
    broker(ui, 'autocomplete', api, 'autocomplete');
    broker(ui, 'autocompletedate', api, 'autocompleteDate');
    broker(ui, 'searching', api, 'search');
    broker(ui, 'confirmroomrename', api, 'renameRoom');
    broker(ui, 'deleteMessage', api, 'onDeleteMessage');
    broker(ui, 'inviteToRoom', api, 'onInviteToRoom');
    broker(ui, 'inviteToOrg', api, 'onInviteToOrg');
    broker(ui, 'setDescription', api, 'onSetDescription');

    broker.pass(api, 'newMessage', ui, 'newMessage');
    broker.pass(api, 'newMsgNotification', ui, 'newMsgNotification');
    broker.pass(api, 'newInviteNotification', ui, 'newInviteNotification');
    broker.pass(api, 'channelRead', ui, 'channelRead');
    broker.pass(api, 'newPMOpened', ui, 'newPMOpened');
    broker.pass(api, 'changeUser', ui, 'changeUser');
    broker.pass(api, 'joinedChannel', ui, 'joinedChannel');
    broker.pass(api, 'leftChannel', ui, 'leftChannel');
    broker.pass(api, 'newRoomMember', ui, 'newRoomMember');
    broker.pass(api, 'memberLeftChannel', ui, 'memberLeftChannel');
    broker.pass(api, 'focusMessage', ui, 'focusMessage');
    broker.pass(api, 'gotHistory', ui, 'gotHistory');
    broker.pass(api, 'nohistory', ui, 'nohistory');
    broker.pass(api, 'roomrenameerror', ui, 'roomrenameerror');
    broker.pass(api, 'roomCreationError', ui, 'roomCreationError');
    broker.pass(api, 'channelupdate', ui, 'channelupdate');
    broker.pass(api, 'userDeleted', ui, 'userDeleted');
    broker.pass(api, 'newOrgMember', ui, 'newOrgMember');
    broker.pass(api, 'newRoom', ui, 'newRoom');
    broker.pass(api, 'roomdeleted', ui, 'roomdeleted');
    broker.pass(api, 'viewChanged', ui, 'viewChanged');
    broker.pass(api, 'userMention', ui, 'userMention');
    broker.pass(api, 'inviteSuccess', ui, 'inviteSuccess');
    broker.pass(api, 'inviteError', ui, 'inviteError');
    broker.pass(api, 'roomInviteSuccess', ui, 'roomInviteSuccess');

    ui.on('starttyping', function (room) {
        api.setTyping(room, true);
    });
    ui.on('stoptyping', function (room) {
        api.setTyping(room, false);
    });
}

