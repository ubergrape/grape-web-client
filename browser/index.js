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
var staticurl = require('staticurl');
var events = require('events');
var notify = require('HTML5-Desktop-Notifications');
var constants = require('cglib').constants;
var tip = require('tip');
var Introjs = require("intro.js").introJs;
var Clipboard = require('clipboard');
var dropAnywhere = require('drop-anywhere');
var timezone = require('./jstz');
var exports = module.exports = UI;

// configure locales and template locals
var template = require('template');
template.root = 'cg/templates';
template.locals.strftime = require('strftime');
var _ = require('t');
// ['de', 'en'].forEach(function (lang) {
// 	_.merge(lang, require('../locale/' + lang));
// });
_.lang('en');
// _ is set here so that the tests which don't load the UI work as well
template.locals._ = _;
template.locals.markdown = require('./markdown');
template.locals.constants = constants;
// XXX: I really don’t want to hack in innerHTML support right now, so just
// make a little workaround here
template.locals.html = function (html) {
	return v.fromDOM(domify(html));
};

// FIXME: change language, for now
// this should be done via a switch in the UI

exports.ItemList = require('./elements/itemlist');
var datejs = require("datejs");
var Navigation = exports.Navigation = require('./elements/navigation');
var RoomPopover = exports.RoomPopover = require('./elements/popovers/room');
//var PMPopover = exports.PMPopover = require('./elements/popovers/pm');
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
var Dropzone = exports.Dropzone = require('./elements/dropzone.js');


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

	this.el = v.toDOM(template('index.jade'));

	// add the navigation to the layout
	var sidebar = qs('.navigation', this.el);
	var navigation = this.navigation = new Navigation();
	sidebar.parentNode.replaceChild(navigation.el, sidebar);

	// initialize the add room popover
	this.addRoom = new RoomPopover();
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
	var invite_placeholder = qs('.invite',this.membersMenu.el);
	invite_placeholder.parentNode.replaceChild(this.invite.el, invite_placeholder);

	// initialize title handler
	this.title = new Title();

	// initialize error/info messages
	this.messages = new Messages();
	qs('.chat-wrapper', this.el).appendChild(this.messages.el);

	// initialize file uploader
	this.upload = new FileUploader(this.options.uploadPath);
	var uploadContainer = qs('.uploader', this.chatInput.el);
	uploadContainer.parentNode.replaceChild(this.upload.el, uploadContainer);

	// initialize the clipboard
	this.clipboard = new Clipboard(window);

	// on paste, check if the pasted item is a blob object -image-,
	// then emit an upload event to the broker to call the uploader
	this.clipboard.on('paste', function(e){
		if(e.items[0] instanceof Blob) this.emit('upload', e.items[0]);
  });

  // initialize dragAndDrop
  // receive the dragged items and emit
  // an event to the uploader to upload them
  var self = this;
  this.dropzone = new Dropzone();
  this.dragAndDrop = dropAnywhere(function(e){
  	e.items.forEach(function(item){
  		self.emit('uploadDragged', item);
  	});
  }, this.dropzone.el);

	// initialize notifications
	this.notifications = new Notifications();
	// only show notification info bar in supported browsers and only if the
	// user has't accepted or declined notifications before
	// don't show it in IE. it only supports notifications in "SiteMode" and
	// there the permission is automatically granted, so no need to ask for it.
	if (notify.isSupported
		&& notify.permissionLevel() === notify.PERMISSION_DEFAULT
		&& (typeof window.external === "undefined" || typeof window.external.msIsSiteMode === "undefined")) {
			this.enableNotificationMessage = this.messages.info(_("Hey there! Please <a class=' enable_notifications'>enable desktop notifications</a> , so your team members can reach you on ChatGrape.  <button class='button enable_notifications'>Enable desktop notifications</button>"));
			classes(qs('body')).add('notifications-disabled');
	}

	// initialize user guide
	this.intro = new Introjs();
	this.intro.setOptions({
		nextLabel: '<strong>' + _('Next') + '</strong>',
		skipLabel: _('Skip'),
		overlayOpacity: 0.4,
		showStepNumbers: false,
		steps: [
			{
				intro: _("<h2>Welcome to ChatGrape - Good to see you.</h2><p>We'll give you a quick overview in 5 simple steps.</p>"),
				tooltipClass: "intro-welcome"
			},
			{
				element: '#intro-step1',
				intro: _("<h2>Writing Smart Messages</h2><p>You can use @ (e.g. @Tobi) to mention people or rooms to send them notifications.</p><p>After adding the first service integration you can use # (e.g. #Pitch Deck) to reference files, tasks, appointments and much more!</p>"),
				position: 'top'
			},
			{
				element: '#intro-step2',
				intro: _("<h2>Rooms</h2><p>This list shows you the rooms you have joined. We've auto-joined you to General, Development and Off-Topic.</p><p>You can see all available rooms in your organization and create a new one by clicking on &quot;All rooms&quot;.</p>"),
				position: 'right'
			},
			{
				element: '#intro-step3',
				intro: _('<h2>Private Messages</h2><p>This list contains the contacts you already have a private conversation with.</p><p>You can start more conversations by clicking on &quot;All members&quot;.</p>'),
				position: 'right'
			},
			{
				element: '#intro-step4',
				intro: _("<h2>Room Members Info</h2><p>This number shows you how many users have joined this room.</p><p>Click it to see all of them or to invite more users to this room.</p>"),
				position: 'bottom'
			},
			{
				intro: _('<h2>That&apos;s it! <i class="fa fa-2x fa-smile"></i></h2><p>Have fun using ChatGrape.</p>'),
			}
		]
	});

	// check timezone
	this.tz = timezone.determine().name();
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
	broker(navigation, 'selectpm', this, 'selectpm');
	// broker(navigation, 'addpm', this.addPM, 'toggle');
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

	// chat header/search functionality
	broker.pass(this.chatHeader, 'searching', this, 'searching');
	broker(this, 'selectchannel', this.chatHeader, 'setRoom');
	broker(this, 'selectchannel', this.membersMenu, 'setRoom');
	broker(this.chatHeader, 'toggleusermenu', this.userMenu, 'toggle');
	broker(this.chatHeader, 'togglemembersmenu', this.membersMenu, 'toggle');
	broker.pass(this.membersMenu, 'deleteroom', this, 'deleteroom');
	broker.pass(this.membersMenu, 'roomdeleted', this, 'roomDeleted');

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
	broker.pass(this.historyView, 'hasread', this, 'hasread');
	broker.pass(this.historyView, 'needhistory', this, 'needhistory');
	broker.pass(this.historyView, 'deletemessage', this, 'deletemessage');
	broker(this.historyView, 'deletemessage', this.chatInput, 'editingDone');
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

	// clipboard
	broker(this.clipboard, 'upload', this.upload, 'doUpload');

	// dragAndDrop
	broker(this, 'uploadDragged', this.upload, 'doUpload');

	this.room = null;
	this.on('selectchannel', function (room) { self.room = room; });
	this.upload.on('uploaded', function (attachment) {
		self.emit('input', self.room, '', {attachments: [attachment.id]});
		self.upload.hide();
	});

	// intro
	this.intro.oncomplete(function() {
		self.emit('introend');
	});
	this.intro.onexit(function() {
		self.emit('introend');
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

UI.prototype.gotHistory = function UI_gotHistory() {
	this.historyView.gotHistory();
};

UI.prototype.noHistory = function UI_noHistory() {
	this.historyView.noHistory();
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

	var pms = org.users.filter(function(user) {
		if (user == self.user) return false;
		return true;
	});
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

UI.prototype.setSettings = function UI_setSettings(settings) {
	this.settings = settings;
	if (this.settings.show_intro) {
		this.intro.start();
	}

	// javscript timezone should always override server timezone setting?
	if (!this.settings.timezone || this.settings.timezone != this.tz) {
		console.log("new timezone; old:", this.settings.timezone, "new:", this.tz);
		this.emit('timezonechange', this.tz);
	}
};

UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
	var self = this;
	var org = orgs.filter(function(o) {
		if (o.id === self.options.organizationID) return o;
	})[0];
	this.emit('selectorganization', org);
};



UI.prototype.channelFromURL = function UI_channelFromURL(path) {
	path = path || location.pathname;
	var pathRegexp = new RegExp((this.options.pathPrefix || '') + '/?(@?)(.*?)/?$');
	var match = path.match(pathRegexp);
	var i;
	// if there is no match, go to "General"
	// if there is no "general" room, go to first room
	// if there is no room at all, we are doomed
	if (!match || !match[2]) {
		for (i = 0; i < this.org.rooms.length; i++) {
			var room = this.org.rooms[i];
			if (room.name === "General") {
				return room;
			}
		}
		return this.org.rooms[0];
	}
	var name = match[2].toLowerCase();
	if (match[1] === '@' && name !== this.user.username) {
		// there'sno channel with yourself
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
			self.selectpm(channel);
		}
	}
};

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
	setTimeout(function(){ msg.remove(); }, 2000);
};

UI.prototype.roomDeleted = function UI_roomDeleted(room) {
	this.selectChannelFromUrl('/'); // don't use '', it won't work

	var msg = this.messages.success(_('Deleted room "' + room.name + '" successfully'));
	setTimeout(function(){ msg.remove(); }, 2000);
};

UI.prototype.selectpm = function UI_selectpm(user) {
	var self = this;
	if (typeof user.pm == 'undefined') {
		self.emit('openpm', user, function() {
			self.emit('selectchannel', user.pm);
		});
	} else {
		self.emit('selectchannel', user.pm);
	}
}
