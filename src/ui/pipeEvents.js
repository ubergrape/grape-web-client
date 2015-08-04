/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = pipeEvents;

function pipeEvents(ui) {
	// ui
	broker(ui, 'selectchannel', ui, 'setRoomContext');

	// roomManager popover
	broker(ui, 'orgReady', ui.roomManager, 'onOrgReady');
	broker.pass(ui.roomManager, 'leaveroom', ui, 'leaveroom');
	broker(ui, 'newRoom', ui.roomManager, 'onNewRoom');
	broker(ui, 'newRoomMember', ui.roomManager, 'onNewRoomMember');
	broker(ui, 'memberLeftChannel', ui.roomManager, 'onMemberLeftChannel');
	broker(ui, 'channelupdate', ui.roomManager, 'onChannelUpdate');
	broker(ui, 'roomdeleted', ui.roomManager, 'onRoomDeleted');
	broker(ui, 'joinedChannel', ui.roomManager, 'onJoinedChannel');
	broker(ui, 'leftChannel', ui.roomManager, 'onLeftChannel');
	broker.pass(ui.roomManager, 'createroom', ui, 'createroom');
	broker(ui, 'endroomcreation', ui.roomManager, 'end');
	broker(ui, 'roomcreateerror', ui.roomManager, 'errorFeedback');
	broker(ui.navigation, 'closeNavPopovers', ui.roomManager, 'end');

	// PMManager popover
	broker(ui, 'orgReady', ui.PMManager, 'onOrgReady');
	broker(ui.navigation, 'triggerPMManager', ui.PMManager, 'onTriggerPMManager');
	broker(ui, 'selectchannel', ui.PMManager, 'onSelectChannel');
	broker(ui, 'change user', ui.PMManager, 'onChangeUser');
	broker(ui, 'new org member', ui.PMManager, 'newOrgMember');
	broker(ui.navigation, 'closeNavPopovers', ui.PMManager, 'end');

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
	broker(ui, 'newRoomMember', ui.chatHeader, 'onNewRoomMember');
	broker(ui, 'memberLeftChannel', ui.chatHeader, 'onMemberLeftChannel');

	// grape input
	broker(ui, 'selectchannel', ui.grapeInput, 'setRoom');
	broker(ui.grapeInput, 'input', ui.historyView, 'onInput');
	broker.pass(ui.historyView, 'send', ui, 'send');
	broker.pass(ui.historyView, 'loadHistoryForSearch', ui, 'loadHistoryForSearch');
	broker.pass(ui.grapeInput, 'update', ui, 'update');
	broker(ui.grapeInput, 'editingdone', ui.historyView, 'unselectForEditing');
	broker.pass(ui.grapeInput, 'starttyping', ui, 'starttyping');
	broker.pass(ui.grapeInput, 'stoptyping', ui, 'stoptyping');
	broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete');
	broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate');
	broker(ui.grapeInput, 'showmarkdowntips', ui, 'showMarkdownTips');
	broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady');

	// history view
	broker(ui, 'orgReady', ui.historyView, 'onOrgReady');
	broker(ui, 'selectchannel', ui.historyView, 'setRoom');
	broker(ui, 'gotHistory', ui.historyView, 'onGotHistory');
	broker(ui, 'nohistory', ui.historyView, 'noHistory');
	broker.pass(ui.historyView, 'hasread', ui, 'hasread');
	broker.pass(ui.historyView, 'needhistory', ui, 'needhistory');
	broker.pass(ui.historyView, 'deleteMessage', ui, 'deleteMessage');
	broker.pass(ui.historyView, 'requestMessage', ui, 'requestMessage');
	broker(ui.historyView, 'toggleinvite', ui.membersMenu, 'toggle');
	broker(ui.historyView, 'selectedforediting', ui.grapeInput, 'editMessage');
	broker(ui.historyView, 'switchToChatMode', ui, 'onSwitchToChatMode');
	broker(ui.historyView, 'switchToChatMode', ui.chatHeader, 'onSwitchToChatMode');
	broker(ui.historyView, 'switchToSearchMode', ui.chatHeader, 'onSwitchToSearchMode');
	broker(ui, 'newMessage', ui.historyView, 'onNewMessage');
	broker(ui, 'focusMessage', ui.historyView, 'onFocusMessage');
	broker(ui, 'newPMOpened', ui.historyView, 'onNewPMOpened');
	broker(ui, 'newRoom', ui.historyView, 'onNewRoom');

	// title
	broker(ui, 'selectchannel', ui.title, 'setRoom');
	broker(ui, 'selectorganization', ui.title, 'setOrganization');

	// notifications
	broker(ui, 'selectchannel', ui.notifications, 'setRoom');
	broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification');
	broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification');
	broker(ui.notifications, 'notificationClicked', ui, 'onNotificationClicked');

	// file upload
	broker(ui, 'selectorganization', ui.upload, 'setOrganization');
	broker(ui.upload, 'uploading', ui.historyView, 'onUploading');

	// clipboard
	broker(ui.clipboard, 'upload', ui.upload, 'doUpload');

	// dragAndDrop
	broker(ui, 'uploadDragged', ui.upload, 'doUpload');

	// membersMenu
	broker(ui, 'toggleinvite', ui.membersMenu, 'toggle');
	broker(ui, 'memberLeftChannel', ui.membersMenu, 'onMemberLeftChannel');
	broker.pass(ui.membersMenu, 'kickMember', ui, 'kickMember');

	// invite
	broker(ui, 'orgReady', ui.invite, 'onOrgReady');
	broker(ui, 'selectchannel', ui.invite, 'setRoom');
	broker.pass(ui.invite, 'invitetoroom', ui, 'invitetoroom');

	// navigation
	broker(ui, 'orgReady', ui.navigation, 'onOrgReady');
	broker(ui, 'newMessage', ui.navigation, 'onNewMessage');
	broker(ui, 'new org member', ui.navigation, 'newOrgMember');
	broker(ui, 'roomdeleted', ui.navigation, 'deleteRoom');
	broker(ui, 'selectchannel', ui.navigation, 'select');
	broker(ui.navigation, 'triggerRoomCreation', ui.roomManager, 'onTriggerRoomCreation');
	broker(ui.navigation, 'triggerRoomManager', ui.roomManager, 'onTriggerRoomManager');
	broker(ui, 'change user', ui.navigation, 'onChangeUser');
	broker(ui, 'channelupdate', ui.navigation, 'onChannelUpdate');
	broker(ui, 'channelRead', ui.navigation, 'onChannelRead');
	broker(ui, 'joinedChannel', ui.navigation, 'onJoinedChannel');
	broker(ui, 'leftChannel', ui.navigation, 'onLeftChannel');
	broker(ui, 'userMention', ui.navigation, 'onUserMention');
}
