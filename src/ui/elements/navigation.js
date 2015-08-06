/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');
var template = require('template');
var qs = require('query');
var events = require('events');
var closest = require('closest');
var ItemList = require('./itemlist');
var render = require('../rendervdom');
var debounce = require('debounce');
var resizable = require('resizable');
var store = require('../store').prefix('navigation');
var clamp = require('../clamp');

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

	document.addEventListener("DOMContentLoaded", function(event) {
		qs('.nav-wrap-out.scrollbars-override', this.el).onscroll = function() { self.handleScrolling(); }

		self.compactMode = store.get('sidebarCompactMode');

		qs('.client-body').style.marginLeft = store.get('sidebarWidth') + 'px';
		self.el.style.width = store.get('sidebarWidth') + 'px';

		if (self.compactMode && self.compactMode == true) {
			qs('.client-body').style.marginLeft = '86px';
			qs('.nav-inner').style.display = 'none';
			qs('.nav-compact').style.display = 'block';
		}

		var navResizable = new resizable(self.el, { directions: ['east'] });
		// the `orgReady` event is fired on reconnection as well
		// so we need to unbind the resizable
		navResizable.element.removeEventListener('resize', resizeClient);

		var resizeClient = function resizeClient() {
			qs('.client-body').style.marginLeft = self.el.clientWidth + 'px';
			store.set('sidebarWidth', self.el.clientWidth);
		}.bind(self);

		// listening to the event fired by the resizable component
		navResizable.element.addEventListener('resize', resizeClient);

		// Initialize all the stuff that will be transitioned in handleScrolling
		self.orgAreaBG = qs('.org-area-bg');
		self.orgAreaBGOverlay = qs('.bg-overlay');
		self.orgInfo = qs('.org-info');
		self.orgLogoName = qs('.org-logo-name img');
		self.orgName = qs('.org-name');
		self.orgTagline = qs('.org-tagline');
    });
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

function scrollTo(element, to, duration) {
    if (duration < 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
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
		minimizeSidebar: function(ev) {
			qs('.client-body').style.marginLeft = '86px';

			qs('.nav-inner').style.display = 'none';
			qs('.nav-compact').style.display = 'block';

			store.set('sidebarCompactMode', true);
		},
		expandSidebar: function(ev) {
			qs('.client-body').style.marginLeft = store.get('sidebarWidth') + 'px';

			qs('.nav-inner').style.display = 'block';
			qs('.nav-compact').style.display = 'none';

			store.set('sidebarCompactMode', false);
		}
	});
	this.events.bind('click .create-room', 'triggerRoomCreation');
	this.events.bind('click .manage-rooms-button', 'triggerRoomManager');
	this.events.bind('click .manage-rooms-button-compact', 'triggerRoomManager');
	this.events.bind('click .minimize-sidebar', 'minimizeSidebar');
	this.events.bind('click .expand-sidebar', 'expandSidebar');
	$clamp(qs('.org-name', self.el), {clamp: 2});
};

Navigation.prototype.handleScrolling = function Navigation_handleScrolling() {
	if (this.scrollStopChecker) {
		clearInterval(this.scrollStopChecker);
	}

	var scrollTop = qs('.nav-wrap-out.scrollbars-override', this.el).scrollTop;
	var newHeight = Math.max(64, 150 - scrollTop);
	var scaleFactor = ((100 / 86) * (newHeight - 64)) / 100;

	this.orgAreaBG.style.height = newHeight + "px";
	this.orgAreaBGOverlay.style.height = newHeight + "px";
	this.orgInfo.style.height = newHeight + "px";

	this.orgLogoName.style.left = "-" + (30 * (1 - scaleFactor)) + "%";
	this.orgLogoName.style.top = (4 * (1 - scaleFactor)) + "px";
	this.orgLogoName.style.width = (42 - (18 * (1 - scaleFactor))) + "px";
	this.orgLogoName.style.height = (42 - (18 * (1 - scaleFactor))) + "px";

	this.orgName.style.top = (-34 * (1 - scaleFactor)) + "px";
	this.orgName.style.marginLeft = (32 * (1 - scaleFactor)) + "%";
	this.orgName.style.marginRight = (2 * (1 - scaleFactor)) + "%";
	this.orgName.style.fontSize = (1.25 - (0.1 * (1 - scaleFactor))) + "em";

	if (scaleFactor == 0.0) {
		$clamp(this.orgName, {clamp: 1});
		this.orgName.style.textAlign = "left";
	} else {
		$clamp(this.orgName, {clamp: 2});
		this.orgName.style.textAlign = "center";
	}

	if (this.orgTagline) {
		this.orgTagline.style.opacity = Math.max(0, 0.6 - (1 - ((2 * scaleFactor) - 1))).toString();

		if (scaleFactor != 1) {
			this.orgTagline.disabled = true;
			this.orgTagline.style.pointerEvents = "none";
		} else {
			this.orgTagline.disabled = false;
			this.orgTagline.style.pointerEvents = "auto";
		}
	}

	this.scrollStopChecker = setInterval(function() {
		if (scrollTop > 0 && scrollTop < 86) {
			if (scrollTop > 43) {
				scrollTo(qs('.nav-wrap-out.scrollbars-override', this.el), 86, 200);
			} else {
				scrollTo(qs('.nav-wrap-out.scrollbars-override', this.el), 0, 200);
			}
		}
	}, 400);
}

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	lists.pms.sort(this.pmCompare);
	this.pmList.setItems(lists.pms);
	this.pmListCompact.setItems(lists.pms);

	lists.rooms.sort(this.roomCompare);
	this.roomList.setItems(lists.rooms);
	this.roomListCompact.setItems(lists.rooms);

	this.pmList.unfiltered = this.pmList.items;
	this.pmListCompact.unfiltered = this.pmListCompact.items;
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
	this.roomList.selectItem(null);
	this.roomListCompact.selectItem(null);
	this.pmList.selectItem(null);
	this.pmListCompact.selectItem(null);
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
	if (this.filtering && line.channel.type === 'pm') return;
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
	if (this.filtering || ui.user == line.author) return;
	this.redraw();
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate() {
	this.roomList.redraw();
	this.roomListCompact.redraw();
}

Navigation.prototype.onChangeUser = function Navigation_onChangeUser(user) {
	if (user == ui.user) return;
	this.pmList.redraw();
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

Navigation.prototype.onUserMention = function Navigation_onUserMention () {
	this.roomListCompact.redraw();
}

Navigation.prototype.newOrgMember = function Navigation_newOrgMember(user) {
	if (this.filtering) return;
	var newPos = this.pmList.items.length;
	this.pmList.items.every(function(pm, index) {
		if (!pm.active) {
			newPos = index;
			return false;
		}
		return true;
	});
	this.pmList.items.splice(newPos, 0, user);
	this.pmList.redraw();
	this.pmListCompact.redraw();
}

Navigation.prototype.onUserDeleted = function Navigation_onUserDeleted (item) {
	// TODO unbind events
	if (this.filtering) return;
	var itemIndex = this.pmList.items.indexOf(item);
	this.pmList.items.splice(itemIndex, 1);
	this.pmList.redraw();
	this.pmListCompact.redraw();
};


Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
	var rooms = org.rooms;
	var pms = org.users.filter(function(user) {
		return ui.user != user && (user.active || (!user.active && user.pm && user.pm.latest_message_time));
	});
	this.setLists({ rooms: rooms, pms: pms });

	// we need this redraw for the organization logo
	// cause that is part of the navigation too
	this.redraw();
}

