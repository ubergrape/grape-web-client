/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');

module.exports = doUIBroker;

function doUIBroker() {
	// addRoom popover
	broker.pass(this.addRoom, 'createroom', this, 'createroom');
	broker.pass(this.addRoom, 'leaveroom', this, 'leaveroom');
	broker(this, 'newRoom', this.addRoom, 'newRoom');
	broker(this.addRoom, 'toggleroomcreation', this.roomCreation, 'toggle');
	broker(this.roomCreation, 'toggleaddroom', this.addRoom, 'toggle');

	// chat header/search functionality
	broker.pass(this.chatHeader, 'searching', this, 'searching');
	broker(this, 'selectchannel', this.chatHeader, 'setRoom');
	broker(this, 'selectchannel', this.membersMenu, 'setRoom');
	broker(this.chatHeader, 'toggleusermenu', this.userMenu, 'toggle');
	broker(this.chatHeader, 'togglemembersmenu', this.membersMenu, 'toggle');
	broker(this.chatHeader, 'toggledeleteroomdialog', this, 'toggleDeleteRoomDialog');
	broker(this.searchView, 'show', this, 'showSearchResults');
	broker(this.searchView, 'hide', this, 'hideSearchResults');
	broker(this.chatHeader, 'stopsearching', this.searchView, 'hideResults');
	broker.pass(this.chatHeader, 'confirmroomrename', this, 'confirmroomrename');
	broker(this, 'channelupdate', this.chatHeader, 'channelUpdate');
	broker(this, 'roomrenameerror', this.chatHeader, 'roomRenameError');
	broker(this, 'joinedchannel', this.chatHeader, 'joinedChannel');
	broker(this, 'leftchannel', this.chatHeader, 'leftChannel');

	// chat input
	broker(this, 'selectchannel', this.chatInput, 'setRoom');
	broker.pass(this.chatInput, 'input', this, 'input');
	broker(this.chatInput, 'input', this.historyView, 'setAuto');
	broker.pass(this.chatInput, 'update', this, 'update');
	broker(this.chatInput, 'editingdone', this.historyView, 'unselectForEditing');
	broker.pass(this.chatInput, 'starttyping', this, 'starttyping');
	broker.pass(this.chatInput, 'stoptyping', this, 'stoptyping');
	broker.pass(this.chatInput, 'autocomplete', this, 'autocomplete');
	broker.pass(this.chatInput, 'autocompletedate', this, 'autocompletedate');

	// history view
	broker(this, 'selectchannel', this.historyView, 'setRoom');
	broker(this, 'gothistory', this.historyView, 'gotHistory');
	broker(this, 'nohistory', this.historyView, 'noHistory');
	broker.pass(this.historyView, 'hasread', this, 'hasread');
	broker(this.historyView, 'hasread', this.navigation, 'hasRead');
	broker.pass(this.historyView, 'needhistory', this, 'needhistory');
	broker.pass(this.historyView, 'deletemessage', this, 'deletemessage');
	broker(this.historyView, 'deletemessage', this.chatInput, 'editingDone');
	broker(this.historyView, 'toggleinvite', this.membersMenu, 'toggle');
	broker(this.historyView, 'selectedforediting', this.chatInput, 'editMessage');
	broker(this.historyView, 'selectchannelfromurl', this, 'selectChannelFromUrl');

	// title
	broker(this, 'selectchannel', this.title, 'setRoom');
	broker(this, 'selectorganization', this.title, 'setOrganization');

	// notifications
	broker(this, 'selectchannel', this.notifications, 'setRoom');
	broker(this, 'newmessage', this.notifications, 'newMessage');
	broker.pass(this.notifications, 'notificationclicked', this, 'selectchannel');

	// invite
	broker(this, 'selectchannel', this.invite, 'setRoom');
	broker.pass(this.invite, 'invitetoroom', this, 'invitetoroom');

	// file upload
	broker(this, 'selectorganization', this.upload, 'setOrganization');

	// clipboard
	broker(this.clipboard, 'upload', this.upload, 'doUpload');

	// dragAndDrop
	broker(this, 'uploadDragged', this.upload, 'doUpload');

	// membersMenu
	broker(this, 'toggleinvite', this.membersMenu, 'toggle');
	broker(this, 'leftchannel', this.membersMenu, 'leftChannel');

	// roomCreation
	broker.pass(this.roomCreation, 'createroom', this, 'createroom');
	broker(this, 'endroomcreation', this.roomCreation, 'end');
	broker(this, 'roomcreateerror', this.roomCreation, 'errorFeedback');

	// navigation
	broker(this, 'org ready', this.navigation, 'setOrganization');
	broker(this, 'deleteduser', this.navigation, 'deleteUser');
	broker(this, 'newmessage', this.navigation, 'newMessage');
	broker(this, 'new org member', this.navigation, 'newOrgMember');
	broker(this, 'roomdeleted', this.navigation, 'deleteRoom');
	broker(this, 'selectchannel', this.navigation, 'select');
	broker(this.navigation, 'addroom', this.addRoom, 'toggle');
}