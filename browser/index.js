/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var v = require('virtualdom');
var Emitter = require('emitter');
var broker = require('broker');
var qs = require('query');
var domify = require('domify');
var escape_html = require('escape-html');
var notification = require('notification');
var classes = require('classes');
var staticurl = require('staticurl');
var events = require('events');
var notify = require('HTML5-Desktop-Notifications');
var constants = require('cglib').constants;
var Introjs = require("intro.js").introJs;
var Clipboard = require('clipboard');
var dropAnywhere = require('drop-anywhere');
var timezone = require('./jstz');
var focus = require('./focus');
var pipeEvents = require('./pipeEvents');
var page = require('page');
var Router = require('../lib/router');

var exports = module.exports = UI;

require("startswith");
require("endswith");

// configure locales and template locals
var template = require('template');
template.root = 'cg/templates';
template.locals.strftime = require('strftime');
var _ = require('t');
// ['de', 'en'].forEach(function (lang) {
// 	_.merge(lang, require('../locale/' + lang));
// });
//_.lang('en');
// _ is set here so that the tests which don't load the UI work as well
template.locals._ = _;
template.locals.escape_html = escape_html;
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
var Navigation = exports.Navigation = require('./elements/navigation');
var RoomPopover = exports.RoomPopover = require('./elements/popovers/room');
var RoomMembersPopover = exports.RoomMembersPopover = require('./elements/popovers/roommembers');
var UserPopover = exports.UserPopover = require('./elements/popovers/user');
var OrganizationPopover = exports.OrganizationPopover = require('./elements/popovers/organization');
var RoomCreationPopover = exports.RoomCreationPopover = require('./elements/popovers/roomcreation');
var ChatHeader = exports.ChatHeader = require('./elements/chatheader');
var GrapeInputIntegration = exports.GrapeInputIntegration = require('./elements/grapeinputintegration');
var HistoryView = exports.HistoryView = require('./elements/historyview');
var Title = exports.Title = require('./titleupdater');
var FileUploader = exports.FileUploader = require('./elements/fileuploader');
var Messages = exports.Messages = require('./elements/messages');
var Notifications = exports.Notifications = require('./elements/notifications');
var SearchView = exports.SearchView = require('./elements/searchview.js');
var Invite = exports.Invite = require('./elements/invite.js');
var Dropzone = exports.Dropzone = require('./elements/dropzone.js');
var DeleteRoomDialog = exports.DeleteRoomDialog = require('./elements/dialogs/deleteroom');
var MarkdownTipsDialog = exports.MarkdownTipsDialog = require('./elements/dialogs/markdowntips');

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
		username: "Loading",
		displayName: "Loading"
	};
	template.locals.org = {
		logo: staticurl("images/orga-image-load.gif"),
		name: "Loading"
	};

	this.el = v.toDOM(template('index.jade'));

	// add the navigation to the layout
	var sidebar = qs('.navigation', this.el);
	var navigation = this.navigation = new Navigation();
	sidebar.parentNode.replaceChild(navigation.el, sidebar);

	// initialize the popovers
	this.addRoom = new RoomPopover();
	this.userMenu = new UserPopover();
	this.membersMenu = new RoomMembersPopover();
	this.organizationMenu = new OrganizationPopover();
	this.searchView = new SearchView();
	this.roomCreation = new RoomCreationPopover();

	this.chatHeader = new ChatHeader();
	qs('.room-header', this.el).appendChild(this.chatHeader.el);

	// initialize the input field
	this.grapeInput = new GrapeInputIntegration();
	qs('.footer', this.el).appendChild(this.grapeInput.el);

	this.markdownTips = new MarkdownTipsDialog().closable();

	this.historyView = new HistoryView();
	var chat = qs('.chat-wrapper .chat', this.el);
	chat.parentNode.replaceChild(this.historyView.el, chat);

	this.invite = new Invite();
	var invite_placeholder = qs('.invite',this.membersMenu.el);
	invite_placeholder.parentNode.replaceChild(this.invite.el, invite_placeholder);

	this.title = new Title();

	this.messages = new Messages();
	qs('.chat-wrapper', this.el).appendChild(this.messages.el);

	this.upload = new FileUploader(this.options.uploadPath);
	var uploadContainer = qs('.uploader', this.grapeInput.el);
	uploadContainer.parentNode.replaceChild(this.upload.el, uploadContainer);

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
			this.enableNotificationMessage = this.messages.info('notifications reminder');
			classes(qs('body')).add('notifications-disabled');
	}

	// initialize user guide
	this.intro = new Introjs();
	this.intro.setOptions({
		nextLabel: '<strong>' + _('Next') + '</strong>',
		skipLabel: _('Skip'),
		overlayOpacity: 0.7,
		showStepNumbers: false,
		showProgress: true,
		showBullets: false,
		steps: [
			{
				intro: _('<img style="float: left;margin-left: -10px" width="120" height="120" src="'+ staticurl("images/mascot/mascot_wave.png") +'"><div style="overflow: hidden"><h2>Hi '+ globalDisplayName +', welcome to ChatGrape!</h2><h3>My name is Trauby and I am here to give you a warm welcome at ChatGrape.</h3><p>The goal is to make your work life more <u>efficient</u>, <u>productive</u> and <u>enjoyable</u>. With the following 5 tips I will give you a quick overview of the chat and its nifty features.</p><p> If you want to talk to us, you can always reach out via <a target="_blank" href="mailto:support@chatgrape.com">support@chatgrape.com</a> or by tweeting at <a href="https://twitter.com/chatgrapecom" target="_blank">@chatgrapecom</a>.</p></div><div style="clear:both"></div>'),
				tooltipClass: "intro-welcome"
			},
			{
				element: '#intro-stepOne',
				intro: _('<img style="float: left;margin-left: -10px" width="110" height="130" src="'+ staticurl("images/mascot/mascot_playing.png") +'"><div style="overflow: hidden"><h2>Juggle your company from <u>one place</u></h2><h3>Access all your company data right from the chat.</h3><p>Add <u>Service Integrations</u> inside of your <u>Organization Settings</u> to make them available inside of ChatGrape. You can search some external websites right away:</p><p><ul class="ver-list"><li>Type <span class="example-text">#youtube: chatgrape</span> to search youtube,</li><li>or <span class="example-text">#gif: explosion</span> to search the internet for gifs.</li></ul></p><p><strong>But most importantly</strong>: Add your own company data in your <u>Organization Settings</u> to browse your files, tasks and appointments within ChatGrape.</p> </div><div style="clear:both;height:1px;width:720px"></div>'),
				position: 'top'
			},
			{
				element: '#intro-step2',
				intro: _('<img style="float: right;margin-right: -10px" width="110" height="130" src="'+ staticurl("images/mascot/mascot_reading.png") +'"><div style="overflow: hidden"><h2>Rooms are a <u>virtual profile of your company</u></h2><h3>Join and create rooms for projects and departments within your organization.</h3><p>You can create and join public and private rooms by clicking the <u>Manage Rooms</u> button in the corner.</p> </div><div style="clear:both;height:1px;width:550px"></div>'),
				position: 'right'
			},
			{
				element: '#intro-step3',
				intro: _('<h2>Communicate 1-on-1</h2><h3>Click on your team members to start private conversations</h3><p>The color dot indicates each user\'s current state:<ul class="ver-list"><li><strong>Green</strong>: The user is online</li><li><strong>Red</strong>: The user is currently not reachable</li><li><strong>Grey</strong>: The user has been removed from the organization</li></ul></p><p>Your private messages are sorted by latest interactions, pushing unread messages to the top.</p><div style="clear:both;height:1px;width:550px"></div>'),
				position: 'right',
				tooltipClass: 'introjs-push-arrow-bottom'
			},
			{
				element: '#intro-step4',
				intro: _('<h2>The Room header</h2><h3>At ChatGrape everything is just one click away.</h3><p>As an admin or room owner, you can modify a <u>Room Name</u> just by clicking the <i class="fa fa-pencil"></i> button.</p><p>You can <u>Delete Rooms</u> by clicking the <i class="fa fa-trash"></i> icon.</p><p>The little round images show the <u>users inside a room</u>. Click the <i class="fa fa-user-plus"></i> button to see all and to invite new users.</p>'),
				position: 'bottom'
			},
			{
				intro: _('<img style="float: left;margin-left: -10px" width="120" height="120" src="'+ staticurl("images/mascot/gifs/trauby_space_sml.gif") +'"><div style="overflow: hidden"><h2>ChatGrape - We Have Lift-off!</h2><h3>With the tutorial out of the way, it\'s now time to set up your organization.</h3><p><u>Manage your rooms</u>, invite your <u>team members</u> and <u>add service integrations</u> in your organization settings.</p><p>If you need help with the setup, don\'t hesitate and contact us right away!</p><p>Cheerio, <br>-Trauby</p></div><div style="clear:both;height:1px;width:720px"></div>'),
			}
		]
	});

	// check timezone
	this.tz = timezone.determine().name();
	this.notificationSessionSet = false;
	this.firstTimeConnect = true;
};

UI.prototype.bind = function UI_bind() {
	pipeEvents(this);
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

	this.room = null;

	this.upload.on('uploaded', function (attachment) {
		self.emit('send', self.room, '', {attachments: [attachment.id]});
		self.upload.hide();
	});

	// intro
	this.intro.oncomplete(function() {
		self.emit('introend');
	});
	this.intro.onexit(function() {
		self.emit('introend');
	});

	// Open certain link in the external browser in the OS X app
	if (typeof MacGap !== 'undefined') {
		var as, i;
		as = qs.all('a', this.organizationMenu.el);
		for (i = 0; i < as.length; ++i) {
			as[i].target = '_blank';
		}
		as = qs.all('a', this.userMenu.el);
		for (i = 0; i < as.length; ++i) {
			if (as[i].href.endsWith('/accounts/settings/')) {
				as[i].target = '_blank';
			}
		}
	}
};

UI.prototype.setOrganization = function UI_setOrganization(org) {
	var self = this;
	this.org = org;
	template.locals.org = this.org;
	this.emit('orgReady', this.org);
	Router(this);
	this.setNotificationsSession();
	if (this.notificationSessionSet == true) return;
	focus.on('focus', this.setNotificationsSession.bind(this));
	this.notificationSessionSet = true;
};

UI.prototype.setUser = function UI_setUser(user) {
	// the first time setUser will be called it hopefully contains the current
	// user and not another one
	if (this.user === undefined || user.id === this.user.id) {
		this.user = user;
		template.locals.user = user;
		this.grapeInput.redraw();
	}
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

UI.prototype.setNotificationsSession = function UI_setNotificationsSession() {
	if(notify.permissionLevel() == notify.PERMISSION_GRANTED)
		this.emit('setNotificationsSession', this.org.id);
}

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
	var self = this;
	self.emit('joinroom', room, function() {
		page('/chat/' + room.slug);
		setTimeout(function() {
			self.emit('toggleinvite', qs('.room-header .room-users-wrap'))
		}, 100);
		self.emit('endroomcreation');
	});
};

UI.prototype.gotError = function UI_gotError(err) {
	notification.error(err.message, err.details);
};

UI.prototype.handleConnectionClosed = function UI_handleConnectionClosed() {
	if (this._connErrMsg == undefined) this._connErrMsg = this.messages.danger('connection lost');
	classes(qs('body')).add('disconnected');
	this.firstTimeConnect = false;
};

UI.prototype.handleReconnection = function UI_handleReconnection() {
	if (this.firstTimeConnect) return;
	if (this._connErrMsg) {
		this._connErrMsg.remove();
		delete this._connErrMsg;
	}
	classes(qs('body')).remove('disconnected');
	var msg = this.messages.success('reconnected')
	setTimeout(function(){ msg.remove(); }, 2000);
};

UI.prototype.setRoomContext = function UI_setRoomContext(room) {
	this.room = room;
}

UI.prototype.toggleDeleteRoomDialog = function UI_toggleDeleteRoomDialog(room) {
	var deleteRoomDialog = new DeleteRoomDialog({
		room: room
	}).closable().overlay().show();
	broker.pass(deleteRoomDialog, 'deleteroom', this, 'deleteroom');
};

UI.prototype.showMarkdownTips = function UI_showMarkdownTips() {
	this.markdownTips.overlay().show();
};

UI.prototype.roomDeleted = function UI_roomDeleted(room) {
	if (this.room != room) return;
	page.replace('/chat/');
	var msg = this.messages.success('room deleted', { room : room.name });
	setTimeout(function(){ msg.remove(); }, 2000);
};

UI.prototype.leftChannel = function UI_leftChannel(room) {
	if (this.room != room) return;
	page.replace('/chat/');
}

UI.prototype.channelUpdate = function UI_channelUpdate(room) {
	if(this.room != room) return;
	page.replace('/chat/' + room.slug);
}

UI.prototype.onMessageNotFound = function UI_onMessageNotFound (room) {
	var redirectSlug = room.type == 'pm' ? '@' + room.users[0].username.toLowerCase() : room.slug;
	page.replace('/chat/' + redirectSlug);
	var msg = this.messages.warning('message not found');
	setTimeout(function(){ msg.remove(); }, 6000);
}

UI.prototype.onNotificationClicked = function UI_onNotificationClicked (channel) {
	if (this.room === channel) return;
	var slug = channel.type === 'pm' ? '@' + channel.users[0].username.toLowerCase() : channel.slug;
	page('/chat/' + slug);
}

UI.prototype.onSwitchToChatMode = function UI_onSwitchToChatMode (room) {
	var redirectSlug = room.type == 'pm' ? '@' + room.users[0].username.toLowerCase() : room.slug;
	page('/chat/' + redirectSlug);
}
