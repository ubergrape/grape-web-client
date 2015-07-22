/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');
var template = require('template');
var qs = require('query');
var events = require('events');
var closest = require('closest');
var resizable = require('resizable');
var ItemList = require('./itemlist');
var render = require('../rendervdom');
var debounce = require('debounce');

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

	var pmList = this.pmList = new ItemList({
		template: 'pmlist.jade',
		selector: '.item a'
	});
	replace(qs('.pms', this.el), pmList.el);

	this.filtering = false;

	var	navScrollbar = new Scrollbars(qs('.nav-wrap-out', this.el));


	this.pmFilterEl = qs('.filter-pms', this.el);
	this.pmFilterEl.addEventListener('keyup', function(ev) {
		self.pmFilter();
	});

	// compute the height of the room list area
	// called every time the pm area is resized
	var resizeRoomList = debounce(function resizeRoomList() {
		var	totHeight = self.el.clientHeight,
			orgInfoHeight = qs('.org-info', self.el).clientHeight,
			navigationHeight = qs('.nav-wrap-out', self.el);
		// saving new sidebar height in localStorage
		navigationHeight.style.height = totHeight - orgInfoHeight + 'px';
	}, 200);

	resizeRoomList();

	// and on window resize
	window.addEventListener('resize', resizeRoomList);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

// route the events
Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		addroom: function (ev) {
			self.emit('addroom', closest(ev.target, 'a', true));
		}
	});
	this.events.bind('click .addroom', 'addroom');
};

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	lists.pms.sort(this.pmCompare);
	this.pmList.setItems(lists.pms);
	this.roomList.setItems(lists.rooms);
	this.pmList.unfiltered = this.pmList.items;
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

Navigation.prototype.select = function Navigation_select(item) {
	this.roomList.selectItem(null);
	this.pmList.selectItem(null);
	this[item.type + 'List'].selectItem(item);
};

Navigation.prototype.pmFilter = function Navigation_pmFilter() {
	var self = this;
	var str = self.pmFilterEl.value;
	var filtered_items = [];

	if (str !== '') {
		this.filtering = true;
		self.pmList.unfiltered.forEach(function(item) {
			if (item.username.startsWithIgnoreCase(str) || item.firstName.startsWithIgnoreCase(str) || item.lastName.startsWithIgnoreCase(str)) {
				filtered_items.push(item);
			}
		});
	} else {
		this.filtering = false;
		filtered_items = self.pmList.unfiltered;
	}

	self.pmList.items = filtered_items;

	self.redraw();
};

// redraw everything, eg when the language changes
Navigation.prototype.redraw = function Navigation_redraw() {
	render(this.nav, template('navigation.jade'));
	if (this.pmList) this.pmList.redraw();
	if (this.roomList) this.roomList.redraw();
};

Navigation.prototype.onNewMessage = function Navigation_onNewMessage(line) {
	if (this.filtering) return;
	if (line.channel.type == 'pm') {
		var pmPartnerIndex = this.pmList.items.indexOf(line.channel.users[0]);
		if (pmPartnerIndex == -1) return;
		this.pmList.items.splice(pmPartnerIndex, 1);
		this.pmList.items.unshift(line.channel.users[0]);
		this.pmList.redraw();
	} else {
		if (line.channel.joined && line.author != ui.user) this.roomList.redraw();
	}
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
}

Navigation.prototype.onUserDeleted = function Navigation_onUserDeleted (item) {
	// TODO unbind events
	if (this.filtering) return;
	var itemIndex = this.pmList.items.indexOf(item);
	this.pmList.items.splice(itemIndex, 1);
	this.pmList.redraw();
};

Navigation.prototype.deleteRoom = function Navigation_deleteRoom() {
	this.roomList.redraw();
}

Navigation.prototype.onChannelRead = function Navigation_onChannelRead(line) {
	if (this.filtering || ui.user == line.author) return;
	this.redraw();
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate() {
	this.roomList.redraw();
}

Navigation.prototype.onChangeUser = function Navigation_onChangeUser(user) {
	if (user == ui.user) return;
	this.pmList.redraw();
}

Navigation.prototype.onJoinedChannel = function Navigation_onJoinedChannel() {
	this.roomList.redraw();
}

Navigation.prototype.onLeftChannel = function Navigation_onLeftChannel() {
	this.roomList.redraw();
}

Navigation.prototype.onUserMention = function Navigation_onUserMention () {
	this.roomList.redraw();
}

Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
	var rooms = org.rooms;
	var pms = org.users.filter(function(user) {
		return self.user != user &&
		(user.active || (!user.active && user.pm && user.pm.latest_message_time));
	});
	this.setLists({ rooms: rooms, pms: pms });
	// we need this redraw for the organization logo
	// cause that is part of the navigation too
	this.redraw();
}

