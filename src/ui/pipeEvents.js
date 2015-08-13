/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = pipeEvents;

function pipeEvents(ui) {
	// ui
	broker(ui, 'selectchannel', ui, 'setRoomContext');

	// roomManager popover
	broker(ui, 'orgReady', ui.roomManager, 'onOrgReady');
	broker(ui, 'newRoom', ui.roomManager, 'onNewRoom');
	broker(ui, 'newRoomMember', ui.roomManager, 'onNewRoomMember');
	broker(ui, 'memberLeftChannel', ui.roomManager, 'onMemberLeftChannel');
	broker(ui, 'channelupdate', ui.roomManager, 'onChannelUpdate');
	broker(ui, 'roomdeleted', ui.roomManager, 'onRoomDeleted');
	broker(ui, 'joinedChannel', ui.roomManager, 'onJoinedChannel');
	broker.pass(ui.roomManager, 'createroom', ui, 'createroom');
	broker(ui, 'endroomcreation', ui.roomManager, 'end');
	broker(ui, 'roomcreateerror', ui.roomManager, 'errorFeedback');
	broker(ui.navigation, 'closeNavPopovers', ui.roomManager, 'end');

	// chat header/search functionality
	broker.pass(ui.chatHeader, 'searching', ui, 'searching');
	broker(ui, 'selectchannel', ui.chatHeader, 'setRoom');
	broker(ui, 'selectchannel', ui.rightSidebar, 'setRoom');
	broker(ui.chatHeader, 'toggleusermenu', ui.userMenu, 'toggle');
	broker(ui.chatHeader, 'togglerightsidebar', ui.rightSidebar, 'toggle');
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

	// pm manager popover
	broker(ui, 'orgReady', ui.PMManager, 'onOrgReady');
	broker(ui, 'newOrgMember', ui.PMManager, 'onNewOrgMember');
	broker(ui.navigation, 'closeNavPopovers', ui.PMManager, 'end');

	// organization popover
	broker(ui, 'orgReady', ui.organizationMenu, 'onOrgReady');
	broker(ui, 'settingsReady', ui.organizationMenu, 'onSettingsReady');
	broker(ui, 'viewChanged', ui.organizationMenu, 'onViewChanged');
	broker.pass(ui.organizationMenu, 'editView', ui, 'editView');

	// navigation
	broker(ui, 'orgReady', ui.navigation, 'onOrgReady');
	broker(ui, 'newMessage', ui.navigation, 'onNewMessage');
	broker(ui, 'roomdeleted', ui.navigation, 'deleteRoom');
	broker(ui, 'selectchannel', ui.navigation, 'select');
	broker(ui.navigation, 'triggerRoomCreation', ui.roomManager, 'onTriggerRoomCreation');
	broker(ui.navigation, 'triggerRoomManager', ui, 'onTriggerRoomManager');
	broker(ui.navigation, 'triggerPMManager', ui.PMManager, 'onTriggerPMManager');
	broker(ui, 'change user', ui.navigation, 'onChangeUser');
	broker(ui, 'channelupdate', ui.navigation, 'onChannelUpdate');
	broker(ui, 'channelRead', ui.navigation, 'onChannelRead');
	broker(ui, 'joinedChannel', ui.navigation, 'onJoinedChannel');
	broker(ui, 'leftChannel', ui.navigation, 'onLeftChannel');

	// right sidebar
	broker.pass(ui.rightSidebar, 'kickMember', ui, 'kickMember');
	broker(ui.rightSidebar, 'toggleInvite', ui, 'onToggleInvite');
}
