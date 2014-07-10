/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var v = require('virtualdom');
var Emitter = require('emitter');
var broker = require('broker');
var qs = require('query');
var domify = require('domify');
var notification = require('notification');
var classes = require('classes');
var staticurl = require('../lib/staticurl');
var events = require('events');
var notify = require('HTML5-Desktop-Notifications');
var tip = require('tip');
var Introjs = require("intro.js").introJs;

var exports = module.exports = UI;

// configure locales and template locals
var template = require('template');
template.root = '/cg/templates';
template.locals.strftime = require('strftime');
var _ = require('t');
['de', 'en'].forEach(function (lang) {
	_.merge(lang, require('../locale/' + lang));
});
_.lang('en');
// _ is set here so that the tests which don't load the UI work as well
template.locals._ = _;
template.locals.markdown = require('./markdown');
// XXX: I really don’t want to hack in innerHTML support right now, so just
// make a little workaround here
template.locals.html = function (html) {
	return v.fromDOM(domify(html));
};

// FIXME: change language, for now
// this should be done via a switch in the UI

exports.ItemList = require('./elements/itemlist');
var Navigation = exports.Navigation = require('./elements/navigation');
var RoomPopover = exports.RoomPopover = require('./elements/popovers/room');
var PMPopover = exports.PMPopover = require('./elements/popovers/pm');
var RoomMembersPopover = exports.RoomMembersPopover = require('./elements/popovers/roommembers');
var UserPopover = exports.UserPopover = require('./elements/popovers/user');
var OrganizationPopover = exports.OrganizationPopover = require('./elements/popovers/organization');
var ChatHeader = exports.ChatHeader = require('./elements/chatheader');
var ChatInput = exports.ChatInput = require('./elements/chatinput');
var HistoryView = exports.HistoryView = require('./elements/historyview');
var Title = exports.Title = require('./titleupdater');
var FileUploader = exports.FileUploader = require('./elements/fileuploader');
var Messages = exports.Messages = require('./elements/messages');
var Notifications = exports.Notifications = require('./elements/notifications');
var SearchView = exports.SearchView = require('./elements/searchview.js');
var Invite = exports.Invite = require('./elements/invite.js');


function UI(options) {
	Emitter.call(this);
	this.options = options || {};
	this.init();
	this.bind();
}

UI.prototype = Object.create(Emitter.prototype);

UI.prototype.init = function UI_init() {
	// set the current language
	_.lang(this.options.languageCode || 'en');
	template.locals._ = _;
	template.locals.staticurl = staticurl;
	// initialize user and org with dummy image
	template.locals.user = {
		avatar: staticurl("images/orga-image-load.gif"),
		username: "loading"
	};
	template.locals.org = {
		logo: staticurl("images/orga-image-load.gif"),
		name: "loading"
	};

	this.el = v.toDOM(template('index'));

	// add the navigation to the layout
	var sidebar = qs('.navigation', this.el);
	var navigation = this.navigation = new Navigation();
	sidebar.parentNode.replaceChild(navigation.el, sidebar);

	// initialize the add room popover
	this.addRoom = new RoomPopover();
	// and the new pm popover
	this.addPM = new PMPopover();
	this.userMenu = new UserPopover();
	this.membersMenu = new RoomMembersPopover();
	this.organizationMenu = new OrganizationPopover();
	this.searchView = new SearchView();

	// initialize the chat header
	this.chatHeader = new ChatHeader();
	qs('.room-header', this.el).appendChild(this.chatHeader.el);

	// initialize the input field
	this.chatInput = new ChatInput();
	qs('.footer', this.el).appendChild(this.chatInput.el);

	// initialize the history view
	this.historyView = new HistoryView();
	var chat = qs('.chat-wrapper .chat', this.el);
	chat.parentNode.replaceChild(this.historyView.el, chat);

	// initialize the invite form
	this.invite = new Invite();
	this.membersMenu.el.appendChild(this.invite.el);

	// initialize title handler
	this.title = new Title();

	// initialize error/info messages
	this.messages = new Messages();
	qs('.chat-wrapper', this.el).appendChild(this.messages.el);

	// initialize file uploader
	this.upload = new FileUploader(this.options.uploadPath);
	var uploadContainer = qs('.uploader', this.chatInput.el);
	uploadContainer.parentNode.replaceChild(this.upload.el, uploadContainer);

	// initialize notifications
	this.notifications = new Notifications();
	if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
		this.enableNotificationMessage = this.messages.info("Hey there! Please <a class=' enable_notifications'>enable desktop notifications</a> , so your team members can reach you on ChatGrape.  <button class='button enable_notifications'>Enable desktop notifications</button>");
		classes(qs('body')).add('notifications-disabled');
	}

	// initialize user guide
	this.intro = new Introjs();
	this.intro.setOptions({
			nextLabel: '<strong>Next</strong>',
			overlayOpacity: .4,
			showStepNumbers: false,
            steps: [
              { 
                intro: "<h2>Hi there! Welcome to ChatGrape!</h2><p>We'll give you a quick overview in 5 simple steps!</p>",
                tooltipClass: "intro-welcome"
              },
              {
                element: '#intro-step1',
                intro: "<h2>Organization Settings</h2><p>These are your organization settings. Here you can add and manage members and external services.</p>",
                position: 'right'
              },
              {
                element: '#intro-step2',
                intro: "<h2>Room Info</h2><p>These are your organization settings. Here you can add and manage members and external services.</p>",
                position: 'right'
              },
              {
                element: '#intro-step3',
                intro: '<h2>Room Info</h2><p>This are the messages.</p>',
                position: 'right'
              },
              {
                element: '#intro-step4',
                intro: "<h2>Room Info</h2><p>This number shows you how many users have joined this room. Click this space to can invite and add users to the room at any time.</p>",
                position: 'bottom'
              },
              {
                element: '#intro-step5',
                intro: "<h2>User Profile</h2><p>Here you can .</p>",
                position: 'left'
              },
              {
                intro: '<h2>All done!</h2><p>Have fun using ChatGrape.</p>',
              }
            ]
          });
	
	
};

UI.prototype.bind = function UI_bind() {
	var self = this;
	var navigation = this.navigation;

	this.events = events(this.el, {
		'toggleOrganizationMenu': function() {
			self.organizationMenu.toggle(qs('.logo'));
		},
		'requestPermission': function() {

			notify.requestPermission(function(permission){
				if (permission !== "default") {
					self.enableNotificationMessage.remove();
					classes(qs('body')).remove('notifications-disabled');
				}
			});
		}
	});
	this.events.bind('click .logo', 'toggleOrganizationMenu');
	this.events.bind('click .enable_notifications', 'requestPermission');

	// bind navigation events
	broker.pass(navigation, 'selectroom', this, 'selectchannel');
	broker(navigation, 'addroom', this.addRoom, 'toggle');
	broker.pass(navigation, 'selectpm', this, 'selectchannel');
	broker(navigation, 'addpm', this.addPM, 'toggle');
	// TODO: interaction of label list
	navigation.on('selectlabel', function (/*label*/) {
		console.log('TODO: implement label change');
	});
	navigation.on('addlabel', function () {
		console.log('TODO: implement new label popover');
	});

	// bind the event to join a room
	// hide the join popover when the room is joined
	// and then automatically select that room
	this.addRoom.on('selectitem', function (item) {
		if (item.joined)
			return self.emit('leaveroom', item);
		self.emit('joinroom', item);
		// TODO: what if the room is currently on display?
		item.once('change joined', function () {
			self.addRoom.hide();
			self.emit('selectchannel', item);
		});
	});
	broker.pass(this.addRoom, 'createroom', this, 'createroom');
	broker.pass(this.addPM, 'selectitem', this, 'openpm');
	// hide the new pm popover when the pm is created
	// and automatically select it
	this.addPM.on('selectitem', function (user) {
		function addlistener(pm) {
			if (pm.users[0] !== user) return;
			self.org.pms.off('add', addlistener);
			self.addPM.hide();
			self.emit('selectchannel', pm);
		}
		self.org.pms.on('add', addlistener);
	});

	// chat header/search functionality
	broker.pass(this.chatHeader, 'searching', this, 'searching');
	broker(this, 'selectchannel', this.chatHeader, 'setRoom');
	broker(this, 'selectchannel', this.membersMenu, 'setRoom');
	broker(this.chatHeader, 'toggleusermenu', this.userMenu, 'toggle');
	broker(this.chatHeader, 'togglemembersmenu', this.membersMenu, 'toggle');

	// chat input
	broker(this, 'selectchannel', this.chatInput, 'setRoom');
	broker.pass(this.chatInput, 'input', this, 'input');
	broker(this.chatInput, 'input', this.historyView, 'setAuto');
	broker.pass(this.chatInput, 'update', this, 'update');
	broker(this.chatInput, 'editingdone', this.historyView, 'unselectForEditing');
	broker.pass(this.chatInput, 'starttyping', this, 'starttyping');
	broker.pass(this.chatInput, 'stoptyping', this, 'stoptyping');
  broker.pass(this.chatInput, 'autocomplete', this, 'autocomplete');

	// history view
	broker(this, 'selectchannel', this.historyView, 'setRoom');
	broker.pass(this.historyView, 'hasread', this, 'hasread');
	broker.pass(this.historyView, 'needhistory', this, 'needhistory');
	broker.pass(this.historyView, 'deletemessage', this, 'deletemessage');
	broker(this.historyView, 'toggleinvite', this.membersMenu, 'toggle');
	broker(this.historyView, 'selectedforediting', this.chatInput, 'editMessage');
	broker(this.historyView, 'selectchannelfromurl', this, 'selectChannelFromUrl');

	// search
	broker(this.searchView, 'show', this, 'showSearchResults');
	broker(this.searchView, 'hide', this, 'hideSearchResults');
	broker(this.chatHeader, 'stopsearching', this.searchView,
			'hideResults');

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
	//broker(this.upload, 'uploaded', this.chatInput, 'addAttachment');
	//broker(this.chatInput, 'input', this.upload, 'hide');
	// directly send an uploaded file
	this.room = null;
	this.on('selectchannel', function (room) { self.room = room; });
	this.upload.on('uploaded', function (attachment) {
		self.emit('input', self.room, '', {attachments: [attachment.id]});
		self.upload.hide();
	});

	// hook up history/pushstate stuff
	this.on('selectchannel', function (channel) {
		navigation.select(channel.type, channel);
		var state = history.state || {};
		if (state.type === channel.type &&
			state.id === channel.id)
			return;
		var url = self.options.pathPrefix || '';
		url += url[url.length - 1] === '/' ? '' : '/';
		url += channel.slug || ('@' + channel.users[0].username.toLowerCase());
		history.pushState({type: channel.type, id: channel.id}, channel.name || '', url);
	});
	window.addEventListener('popstate', function (ev) {
		if (!ev.state) return;
		var which = self.org[ev.state.type + 's'];
		for (var i = 0; i < which.length; i++) {
			var el = which[i];
			if (el.id === ev.state.id)
				return self.emit('selectchannel', el);
		}
	});
};

UI.prototype.gotHistory = function UI_gotHistory(room, lines) {
	this.historyView.gotHistory(room, lines);
};

UI.prototype.displaySearchResults = function UI_displaySearchResults(results) {
	this.searchView.showResults(results);
};

UI.prototype.showSearchResults = function() {
	classes(this.el).add('searching');
};

UI.prototype.hideSearchResults = function() {
	classes(this.el).remove('searching');
	this.chatHeader.clearSearch();
};

UI.prototype.roomCreated = function UI_roomCreated(room) {
	this.addRoom.closeform();
	// XXX: this is not really clean, but oh well
	this.addRoom.emit('selectitem', room);
};

UI.prototype.roomCreateError = function UI_roomCreateError(err) {
	this.addRoom.validationError(err);
};

UI.prototype.gotError = function UI_gotError(err) {
	console.log(err);
	notification.error(err.message, err.details);
};

UI.prototype.setOrganization = function UI_setOrganization(org) {
	var self = this;
	this.org = org;
	template.locals.org = this.org;
	// set the items for the nav list
	var rooms = org.rooms;
//	rooms = [
//		{id: 1, name: 'Design'},
//		{id: 2, name: 'Infrastruktur'},
//		{id: 3, name: 'Marketing'},
//		{id: 4, name: 'Privat', 'private': true, unread: 2}
//	].map(function (r) { r.joined = true; return Emitter(r); });
//	rooms = Emitter(rooms);
	var pms = org.pms;
//	var pms = [
//		{id: 1, username: 'Tobias Seiler', status: 16},
//		{id: 2, username: 'Leo Fasbender', status: 0},
//		{id: 3, username: 'Lea de Roucy', status: 16, unread: 1}
//	].map(function (r) { return Emitter(r); });
//	pms = Emitter(pms);
	var labels = [];// FIXME: add real labels
	labels = [
		{id: 1, name: '#github', icon: 'github'},
		{id: 2, name: '#entscheidungen', icon: 'check-circle'},
		{id: 3, name: '#termine', icon: 'calendar'},
	].map(function (r) { return new Emitter(r); });
	labels = new Emitter(labels);

	this.navigation.setLists({
		rooms: rooms,
		pms: pms,
		labels: labels
	});

	// set the items for the add room popover
	this.addRoom.setItems(rooms);

	// filter those users with which there is already a PM open
	function refreshNoPMUsers() {
		var pmusers = Object.create(null);
		pms.forEach(function (pm) {
			pm.users.forEach(function (u) {
				pmusers[u.id] = true;
			});
		});
		var nopmusers = org.users.filter(function (u) {
			if (u === self.user) return false;
			return !(u.id in pmusers);
		});

		// set the items for the new PM popover
		self.addPM.setItems(nopmusers);
	}
	refreshNoPMUsers();
	org.users.on('change', refreshNoPMUsers);
	org.pms.on('change', refreshNoPMUsers);

	// update logo
	// XXX: is this how it should be done? I guess not
	qs('.logo img').src = org.logo;
	qs('.logo img').alt = org.name;
	qs('.logo .name').innerHTML = org.name;

	// switch to the channel indicated by the URL
	// XXX: is this the right place?
	this.selectChannelFromUrl();
};

UI.prototype.setUser = function UI_setUser(user) {
	// the first time setUser will be called it hopefully contains the current
	// user and not another one
	if (this.user === undefined || user.id === this.user.id) {
		this.user = user;
		template.locals.user = user;
		this.chatInput.redraw();
	}
	this.historyView.redraw();
};

UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
	var self = this;
	var org = orgs.filter(function(o) {
		if (o.id === self.options.organizationID) return o;
	})[0];
	this.emit('selectorganization', org);
};

UI.prototype.channelFromURL = function UI_channelFromURL(path) {
	var path = path || location.pathname;
	var pathRegexp = new RegExp((this.options.pathPrefix || '') + '/?(@?)(.*?)/?$');
	var match = path.match(pathRegexp);
	var i;
	// if there is no match, go to the first room
	// if there is not room, we are doomed
	if (!match[2]) {
		for (i = 0; i < this.org.rooms.length; i++) {
			var room = this.org.rooms[i];
			if (room.name === "General") {
				return room;
			}
		}
		return this.org.rooms[0];
	};
	var name = match[2].toLowerCase();
	if (match[1] === '@') {
		// match users
		for (i = 0; i < this.org.users.length; i++) {
			var user = this.org.users[i];
			if (user.username.toLowerCase() === name)
				return user;
		}
	} else {
		// match rooms
		for (i = 0; i < this.org.rooms.length; i++) {
			var room = this.org.rooms[i];
			if (room.slug === name)
				return room;
		}
	}
};

UI.prototype.selectChannelFromUrl = function UI_selectChannelFromUrl(path) {
	var self = this;

	// this will actually return a channel or a user
	var channel = self.channelFromURL(path);

	function addlistener(pm) {
		if (pm.users[0] !== channel) return;
		self.org.pms.off('add', addlistener);
		self.emit('selectchannel', pm);
	}

	if (channel) {
		if (channel.type === "room") {
			if (!channel.joined)
				self.emit('joinroom', channel);
			self.emit('selectchannel', channel);
		} else {
			var user = channel;
			var pm = self.isPmOpen(user);
			if (!pm) {
				self.org.pms.on('add', addlistener);
				self.emit('openpm', user);
			} else {
				self.emit('selectchannel', pm);
			}
		}
	}
};

UI.prototype.isPmOpen = function UI_isPmOpen(user) {
	for (var i = 0; i < this.org.pms.length; i++) {
		var pm = this.org.pms[i];
		var pmuser = pm.users[0];
		if (pmuser === user)
			return pm;
	}
}

UI.prototype.handleConnectionClosed = function UI_handleConnectionClosed() {
	if (this._connErrMsg == undefined)
		this._connErrMsg = this.messages.warning(_('Lost Connection to the server - trying to reconnect. You can also try to <a href="#" onClick="window.location.reload()" >reload</a>. '));
	classes(qs('body')).add('disconnected');
};

UI.prototype.handleReconnection = function UI_handleReconnection(reconnected) {
	if (!reconnected) return;
	if (this._connErrMsg) {
		this._connErrMsg.remove();
		delete this._connErrMsg;
	}
	classes(qs('body')).remove('disconnected');
	var msg = this.messages.success(_('Reconnected successfully'));
	setTimeout(function(){msg.remove()}, 2000);
};
