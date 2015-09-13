/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = pipeEvents;

function pipeEvents(ui) {
	// ui
	broker(ui, 'selectchannel', ui, 'setRoomContext');
	broker(ui, 'selectchannel', ui.chatHeader, 'setRoom');
	broker(ui, 'channelupdate', ui.chatHeader, 'channelUpdate');
	broker(ui, 'roomrenameerror', ui.chatHeader, 'roomRenameError');
	broker(ui, 'selectchannel', ui.rightSidebar, 'setRoom');
	broker(ui, 'orgReady', ui.grapeInput, 'onOrgReady');
	broker(ui, 'selectchannel', ui.grapeInput, 'setRoom');
	broker(ui, 'orgReady', ui.historyView, 'onOrgReady');
	broker(ui, 'selectchannel', ui.historyView, 'setRoom');
	broker(ui, 'gotHistory', ui.historyView, 'onGotHistory');
	broker(ui, 'nohistory', ui.historyView, 'noHistory');
	broker(ui, 'newMessage', ui.historyView, 'onNewMessage');
	broker(ui, 'focusMessage', ui.historyView, 'onFocusMessage');
	broker(ui, 'newPMOpened', ui.historyView, 'onNewPMOpened');
	broker(ui, 'newRoom', ui.historyView, 'onNewRoom');
	broker(ui, 'changeUser', ui.historyView, 'onChangeUser');
	broker(ui, 'selectchannel', ui.title, 'setRoom');
	broker(ui, 'selectorganization', ui.title, 'setOrganization');
	broker(ui, 'selectchannel', ui.notifications, 'setRoom');
	broker(ui, 'newMsgNotification', ui.notifications, 'onNewMsgNotification');
	broker(ui, 'newInviteNotification', ui.notifications, 'onNewInviteNotification');
	broker(ui, 'selectorganization', ui.upload, 'setOrganization');
	broker(ui, 'uploadDragged', ui.upload, 'doUpload');
	broker(ui, 'orgReady', ui.organizationMenu, 'onOrgReady');
	broker(ui, 'settingsReady', ui.organizationMenu, 'onSettingsReady');
	broker(ui, 'viewChanged', ui.organizationMenu, 'onViewChanged');
	broker(ui, 'orgReady', ui.navigation, 'onOrgReady');
	broker(ui, 'newMessage', ui.navigation, 'onNewMessage');
	broker(ui, 'roomdeleted', ui.navigation, 'deleteRoom');
	broker(ui, 'selectchannel', ui.navigation, 'select');
	broker(ui, 'userMention', ui.navigation, 'onUserMention');
	broker(ui, 'changeUser', ui.navigation, 'onChangeUser');
	broker(ui, 'channelupdate', ui.navigation, 'onChannelUpdate');
	broker(ui, 'channelRead', ui.navigation, 'onChannelRead');
	broker(ui, 'joinedChannel', ui.navigation, 'onJoinedChannel');
	broker(ui, 'leftChannel', ui.navigation, 'onLeftChannel');
	broker(ui, 'changeUser', ui.rightSidebar, 'onChangeUser');
	broker(ui, 'memberLeftChannel', ui.rightSidebar, 'onMemberLeftChannel');
	broker(ui, 'newRoomMember', ui.rightSidebar, 'onNewRoomMember');

	// chat header
	broker.pass(ui.chatHeader, 'searching', ui, 'searching');
	broker.pass(ui.chatHeader, 'confirmroomrename', ui, 'confirmroomrename');
	broker(ui.chatHeader, 'toggleRightSidebar', ui, 'onToggleRightSidebar');
	broker(ui.chatHeader, 'toggledeleteroomdialog', ui, 'toggleDeleteRoomDialog');
	broker(ui.chatHeader, 'stopsearching', ui.searchView, 'hideResults');

	// search
	broker(ui.searchView, 'show', ui, 'showSearchResults');
	broker(ui.searchView, 'hide', ui, 'hideSearchResults');

	// grape input
	broker.pass(ui.grapeInput, 'update', ui, 'update');
	broker.pass(ui.grapeInput, 'starttyping', ui, 'starttyping');
	broker.pass(ui.grapeInput, 'stoptyping', ui, 'stoptyping');
	broker.pass(ui.grapeInput, 'autocomplete', ui, 'autocomplete');
	broker.pass(ui.grapeInput, 'autocompletedate', ui, 'autocompletedate');
	broker(ui.grapeInput, 'editingdone', ui.historyView, 'unselectForEditing');
	broker(ui.grapeInput, 'input', ui.historyView, 'onInput');
	broker(ui.grapeInput, 'showmarkdowntips', ui, 'showMarkdownTips');

	// history view
	broker.pass(ui.historyView, 'hasread', ui, 'hasread');
	broker.pass(ui.historyView, 'needhistory', ui, 'needhistory');
	broker.pass(ui.historyView, 'deleteMessage', ui, 'deleteMessage');
	broker.pass(ui.historyView, 'requestMessage', ui, 'requestMessage');
	broker.pass(ui.historyView, 'send', ui, 'send');
	broker.pass(ui.historyView, 'loadHistoryForSearch', ui, 'loadHistoryForSearch');
	broker(ui.historyView, 'selectedforediting', ui.grapeInput, 'editMessage');
	broker(ui.historyView, 'switchToChatMode', ui, 'onSwitchToChatMode');
	broker(ui.historyView, 'switchToChatMode', ui.chatHeader, 'onSwitchToChatMode');
	broker(ui.historyView, 'switchToSearchMode', ui.chatHeader, 'onSwitchToSearchMode');
	broker(ui.historyView, 'toggleInvite', ui, 'onToggleInvite');

	// notifications
	broker(ui.notifications, 'notificationClicked', ui, 'onNotificationClicked');

	// file upload
	broker(ui.upload, 'uploading', ui.historyView, 'onUploading');
	broker(ui.upload, 'uploading', ui, 'onUploading');
	broker(ui.upload, 'uploaded', ui, 'onUploaded');

	// clipboard
	broker(ui.clipboard, 'upload', ui.upload, 'doUpload');

	// organization popover
	broker.pass(ui.organizationMenu, 'editView', ui, 'editView');

	// navigation
	broker(ui.navigation, 'triggerRoomManager', ui, 'onTriggerRoomManager');
	broker(ui.navigation, 'triggerPMManager', ui, 'onTriggerPMManager');

	// right sidebar
	broker.pass(ui.rightSidebar, 'kickMember', ui, 'kickMember');
	broker(ui.rightSidebar, 'toggleInvite', ui, 'onToggleInvite');
	broker(ui.rightSidebar, 'hideRightSidebar', ui, 'onHideRightSidebar');
}
