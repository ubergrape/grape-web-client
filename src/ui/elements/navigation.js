/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');
var template = require('template');
var qs = require('query');
var events = require('events');
var closest = require('closest');
var ItemList = require('./itemlist');
var classes = require('classes');
var render = require('../rendervdom');
var debounce = require('debounce');
var resizable = require('resizable');
var store = require('../store').prefix('navigation');
var clamp = require('clamp');

module.exports = Navigation;

function Navigation() {
	Emitter.call(this);
	this.init();
	this.bind();
}

Navigation.prototype = Object.create(Emitter.prototype);

Navigation.prototype.init = function Navigation_init() {
	var self = this;
	this.nav = {};
	this.redraw();
	this.el = this.nav.el;

	var roomList = this.roomList = new ItemList({
		template: 'roomlist.jade',
		selector: '.item a'
	});
	replace(qs('.rooms', this.el), roomList.el);

	var roomListCompact = this.roomListCompact = new ItemList({
		template: 'roomlist-compact.jade',
		selector: '.item a'
	});
	replace(qs('.rooms-compact', this.el), roomListCompact.el);

	var pmList = this.pmList = new ItemList({
		template: 'pmlist.jade',
		selector: '.item a'
	});
	replace(qs('.pms', this.el), pmList.el);

	var pmListCompact = this.pmListCompact = new ItemList({
		template: 'pmlist-compact.jade',
		selector: '.item a'
	});
	replace(qs('.pms-compact', this.el), pmListCompact.el);

	var	navScrollbar = new Scrollbars(qs('.nav-wrap-out', this.el));
	var	navScrollbarCompact = new Scrollbars(qs('.nav-wrap-out-compact', this.el));
	var headerCollapsed = false;

	document.addEventListener("DOMContentLoaded", function(event) {
		qs('.nav-wrap-out.scrollbars-override', this.el).onscroll = function() { self.handleScrolling(); }

		self.compactMode = store.get('sidebarCompactMode');

		var sidebarWidth = store.get('sidebarWidth');
		if (sidebarWidth == null) {
			sidebarWidth = "240";
		}

		qs('.client-body').style.marginLeft = sidebarWidth + 'px';
		self.el.style.width = sidebarWidth + 'px';

		if (self.compactMode && self.compactMode == true) {
			classes(document.body).remove("nav-style-basic");
			classes(document.body).add("nav-style-collapsed");
		} else {
			classes(document.body).add("nav-style-basic");
			classes(document.body).remove("nav-style-collapsed");
		}

		var navResizable = new resizable(self.el, { directions: ['east'] });

		var resizeClient = function resizeClient() {
			qs('.client-body').style.marginLeft = self.el.clientWidth + 'px';
			store.set('sidebarWidth', self.el.clientWidth);
		}.bind(self);

		// listening to the event fired by the resizable component
		navResizable.element.addEventListener('resize', resizeClient);
		window.addEventListener('resize', resizeClient);

		// Initialize all the stuff that will be transitioned in handleScrolling
		self.orgAreaBG = qs('.org-area-bg');
		self.orgAreaBGOverlay = qs('.bg-overlay');
		self.orgInfo = qs('.org-info');
		self.orgLogoName = qs('.org-logo-name img');
		self.orgName = qs('.org-name');
		self.orgTagline = qs('.org-tagline');

		$clamp(self.orgName, {clamp: 2});
		self.clampedSingleLine = false;
    });
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

function animate(element, style, unit, from, to, time) {
    if (!element) return;

    var start = new Date().getTime(),
        timer = setInterval(function() {
            var step = Math.min(1,(new Date().getTime() - start) / time);
            element.style[style] = (from + step * (to - from)) + unit;
            if (step == 1) clearInterval(timer);
        }, 25);

    element.style[style] = from + unit;
}

Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		triggerRoomCreation: function (ev) {
			self.emit('triggerRoomCreation', closest(ev.target, 'div', true));
		},
		triggerRoomManager: function(ev) {
			self.emit('triggerRoomManager', closest(ev.target, 'a', true));
		},
		triggerPMManager: function(ev) {
			self.emit('triggerPMManager', closest(ev.target, 'div', true));
		},
		minimizeSidebar: function(ev) {
			store.set('sidebarWidth', self.el.clientWidth);
			classes(document.body).remove("nav-style-basic");
			classes(document.body).add("nav-style-collapsed");

			store.set('sidebarCompactMode', true);
		},
		expandSidebar: function(ev) {
			var oldWidth = store.get('sidebarWidth') + 'px';

			classes(document.body).add("nav-style-basic");
			classes(document.body).remove("nav-style-collapsed");

			store.set('sidebarCompactMode', false);
		}
	});
	this.events.bind('click .create-room', 'triggerRoomCreation');
	this.events.bind('click .manage-rooms-button', 'triggerRoomManager');
	this.events.bind('click .manage-rooms-button-compact', 'triggerRoomManager');
	this.events.bind('click .addpm', 'triggerPMManager');
	this.events.bind('click .minimize-sidebar', 'minimizeSidebar');
	this.events.bind('click .expand-sidebar', 'expandSidebar');
};

Navigation.prototype.handleScrolling = function Navigation_handleScrolling() {
	var scrollTop = qs('.nav-wrap-out.scrollbars-override', this.el).scrollTop;
	var newHeight = Math.max(64, 150 - scrollTop);
	var scaleFactor = ((100 / 86) * (newHeight - 64)) / 100;

	if (newHeight < 150 && !this.headerCollapsed) {
		classes(this.orgAreaBG).add("collapse-header-height");
		classes(this.orgAreaBGOverlay).add("collapse-header-height");
		classes(this.orgInfo).add("collapse-header-height");

		classes(this.orgLogoName).add("collapse-logo");
		classes(this.orgName).add("collapse-name");
		this.orgName.style.opacity = "0";

		this.headerCollapsed = true;

		setTimeout(function() {
			var orgName = qs('.org-name');
			orgName.style.textAlign = "left";
			$clamp(orgName, {clamp: 1});

			orgName.style.opacity = "1";
		}, 225);
	} else if (newHeight == 150 && this.headerCollapsed) {
		classes(this.orgAreaBG).remove("collapse-header-height");
		classes(this.orgAreaBGOverlay).remove("collapse-header-height");
		classes(this.orgInfo).remove("collapse-header-height");

		classes(this.orgLogoName).remove("collapse-logo");
		classes(this.orgName).remove("collapse-name");
		this.orgName.style.opacity = "0";

		this.headerCollapsed = false;

		setTimeout(function() {
			var orgName = qs('.org-name');

			orgName.innerHTML = ui.org.name;
			orgName.style.textAlign = "center";
			$clamp(orgName, {clamp: 2});

			orgName.style.opacity = "1";
		}, 150);
	}
}

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	lists.pms.sort(this.pmCompare);
	this.pmList.setItems(lists.pms);
	this.pmListCompact.setItems(lists.pms);

	lists.rooms.sort(this.roomCompare);
	this.roomList.setItems(lists.rooms);
	this.roomListCompact.setItems(lists.rooms);
};

Navigation.prototype.pmCompare = function Navigation_pmCompare(a, b) {

	function getStatusValue(user) {
		if (!user.active) return 0;
		if (user.status == 16) return 3;
		if (user.is_only_invited) return 1;
		return 2;
	}

	var aLastMessage = a.pm && a.active ? a.pm.latest_message_time : 0;
	var bLastMessage = b.pm && b.active ? b.pm.latest_message_time : 0;

	if (bLastMessage - aLastMessage != 0)
		return bLastMessage - aLastMessage;
	else
		return getStatusValue(b) - getStatusValue(a);
}

Navigation.prototype.roomCompare = function Navigation_roomCompare(a, b) {
	return b.latest_message_time - a.latest_message_time;
}

Navigation.prototype.select = function Navigation_select(item) {
	console.log('select');
	this.roomList.selectItem(null);
	this.roomListCompact.selectItem(null);
	this.pmList.selectItem(null);
	this.pmListCompact.selectItem(null);
	if (item.type === 'pm') {
		var pm = item.users[0];
		var isInList = this.pmList.items.indexOf(pm) > -1 ? true : false;
		if (!isInList) this.pmList.items.unshift(pm);
	}
	this[item.type + 'List'].selectItem(item);
	this[item.type + 'ListCompact'].selectItem(item);
};

Navigation.prototype.redraw = function Navigation_redraw() {
	render(this.nav, template('navigation.jade'));
	if (this.pmList) this.pmList.redraw();
	if (this.pmListCompact) this.pmListCompact.redraw();
	if (this.roomList) this.roomList.redraw();
	if (this.roomListCompact) this.roomListCompact.redraw();
};

Navigation.prototype.onNewMessage = function Navigation_onNewMessage(line) {
	var list = line.channel.type === 'pm' ? this.pmList : this.roomList;
	var compactList = list == this.pmList ? this.pmListCompact : this.roomListCompact;
	var item = line.channel.type === 'pm' ? line.channel.users[0] : line.channel;
	var itemIndex = list.items.indexOf(item);
	if (itemIndex == -1) return;

	list.items.splice(itemIndex, 1);
	list.items.unshift(item);
	list.redraw();
	compactList.redraw();
}

Navigation.prototype.deleteRoom = function Navigation_deleteRoom() {
	this.roomList.redraw();
	this.roomListCompact.redraw();
}

Navigation.prototype.onChannelRead = function Navigation_onChannelRead(line) {
	if (ui.user == line.author) return;
	this.redraw();
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate() {
	this.roomList.redraw();
	this.roomListCompact.redraw();
}

Navigation.prototype.onChangeUser = function Navigation_onChangeUser(user) {
	if (user == ui.user) return;
	var pmList = this.pmList;
	if (pmList.items.indexOf(user) == -1) pmList.items.push(user);
	pmList.redraw();
	this.pmListCompact.redraw();
}

Navigation.prototype.onJoinedChannel = function Navigation_onJoinedChannel() {
	this.roomList.redraw();
	this.roomListCompact.redraw();
}

Navigation.prototype.onLeftChannel = function Navigation_onLeftChannel() {
	this.roomList.redraw();
	this.roomListCompact.redraw();
}

Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
	var rooms = org.rooms;
	var pms = org.users.filter(function(user) {
		return user != ui.user && user.active && !user.is_only_invited;
	});
	this.setLists({ rooms: rooms, pms: pms });

	// we need this redraw for the organization logo
	// cause that is part of the navigation too
	this.redraw();
}

