/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = pipeEvents;

function pipeEvents(ui) {
	// ui
	broker(ui, 'selectchannel', ui, 'setRoomContext');

	// addRoom popover
	broker(ui, 'orgReady', ui.addRoom, 'onOrgReady');
	broker.pass(ui.addRoom, 'createroom', ui, 'createroom');
	broker.pass(ui.addRoom, 'leaveroom', ui, 'leaveroom');
	broker(ui, 'newroom', ui.addRoom, 'newRoom');
	broker(ui.addRoom, 'toggleroomcreation', ui.roomCreation, 'toggle');
	broker(ui.roomCreation, 'toggleaddroom', ui.addRoom, 'toggle');
	broker(ui, 'joinedchannel', ui.addRoom, 'onJoinedChannel');
	broker(ui, 'leftchannel', ui.addRoom, 'onLeftChannel');
	broker(ui, 'channelupdate', ui.addRoom, 'onChannelUpdate');
	broker(ui, 'roomdeleted', ui.addRoom, 'onRoomDeleted');

	// chat header/search functionality
	broker.pass(ui.chatHeader, 'searching', ui, 'searching');
	broker(ui, 'selectchannel', ui.chatHeader, 'setRoom');
	broker(ui, 'selectchannel', ui.membersMenu, 'setRoom');
	broker(ui.chatHeader, 'toggleusermenu', ui.userMenu, 'toggle');
	broker(ui.chatHeader, 'togglemembersmenu', ui.membersMenu, 'toggle');
	broker(ui.chatHeader, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog');
	broker(ui.searchView, 'show', ui, 'showSearchResults');
	broker(ui.searchView, 'hide', ui, 'hideSearchResults');
	broker(ui.chatHeader, 'stopsearching', ui.searchView, 'hideResults');
	broker.pass(ui.chatHeader, 'confirmroomrename', ui, 'confirmroomrename');
	broker(ui, 'channelupdate', ui.chatHeader, 'channelUpdate');
	broker(ui, 'roomrenameerror', ui.chatHeader, 'roomRenameError');
	broker(ui, 'joinedchannel', ui.chatHeader, 'joinedChannel');
	broker(ui, 'leftchannel', ui.chatHeader, 'leftChannel');

	// grape input
	broker(ui, 'selectchannel', ui.grapeInput, 'setRoom');
	broker.pass(ui.grapeInput, 'input', ui, 'input');
	broker(ui.grapeInput, 'input', ui.historyView, 'setAuto');
	broker.pass(ui.grapeInput, 'update', ui, 'update');
	broker(ui.grapeInput, 'editingdone', ui.historyView, 'unselectForEditing');
	broker.pass(ui.grapeInput, 'starttyping', ui, 'starttyping');
	broker.pass(ui.grapeInput, 'stoptyping', ui, 'stoptyping');
	broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete');
	broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate');
	broker(ui.grapeInput, 'showmarkdowntips', ui, 'showMarkdownTips');
	broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady');

	// history view
	broker(ui, 'selectchannel', ui.historyView, 'setRoom');
	broker(ui, 'gothistory', ui.historyView, 'gotHistory');
	broker(ui, 'nohistory', ui.historyView, 'noHistory');
	broker.pass(ui.historyView, 'hasread', ui, 'hasread');
	broker.pass(ui.historyView, 'needhistory', ui, 'needhistory');
	broker.pass(ui.historyView, 'deletemessage', ui, 'deletemessage');
	broker(ui.historyView, 'deletemessage', ui.grapeInput, 'editingDone');
	broker(ui.historyView, 'toggleinvite', ui.membersMenu, 'toggle');
	broker(ui.historyView, 'selectedforediting', ui.grapeInput, 'editMessage');

	// title
	broker(ui, 'selectchannel', ui.title, 'setRoom');
	broker(ui, 'selectorganization', ui.title, 'setOrganization');

	// notifications
	broker(ui, 'selectchannel', ui.notifications, 'setRoom');
	broker(ui, 'newNotification', ui.notifications, 'onNewNotification');
	broker.pass(ui.notifications, 'notificationclicked', ui, 'selectchannel');

	// file upload
	broker(ui, 'selectorganization', ui.upload, 'setOrganization');

	// clipboard
	broker(ui.clipboard, 'upload', ui.upload, 'doUpload');

	// dragAndDrop
	broker(ui, 'uploadDragged', ui.upload, 'doUpload');

	// membersMenu
	broker(ui, 'toggleinvite', ui.membersMenu, 'toggle');
	broker(ui, 'leftchannel', ui.membersMenu, 'leftChannel');

	// roomCreation
	broker.pass(ui.roomCreation, 'createroom', ui, 'createroom');
	broker(ui, 'endroomcreation', ui.roomCreation, 'end');
	broker(ui, 'roomcreateerror', ui.roomCreation, 'errorFeedback');

	// invite
	broker(ui, 'orgReady', ui.invite, 'onOrgReady');
	broker(ui, 'selectchannel', ui.invite, 'setRoom');
	broker.pass(ui.invite, 'invitetoroom', ui, 'invitetoroom');

	// navigation
	broker(ui, 'orgReady', ui.navigation, 'onOrgReady');
	broker(ui, 'deleteduser', ui.navigation, 'deleteUser');
	broker(ui, 'newmessage', ui.navigation, 'newMessage');
	broker(ui, 'new org member', ui.navigation, 'newOrgMember');
	broker(ui, 'roomdeleted', ui.navigation, 'deleteRoom');
	broker(ui, 'selectchannel', ui.navigation, 'select');
	broker(ui.navigation, 'addroom', ui.addRoom, 'toggle');
	broker(ui, 'change user', ui.navigation, 'onChangeUser');
	broker(ui, 'channelupdate', ui.navigation, 'onChannelUpdate');
	broker(ui, 'leftchannel', ui.navigation, 'onLeftChannel');
	broker(ui, 'channelRead', ui.navigation, 'onChannelRead');
	broker(ui, 'joinedchannel', ui.navigation, 'onJoinedChannel');
}
