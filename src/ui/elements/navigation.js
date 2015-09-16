/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');
var template = require('template');
var qs = require('query');
var events = require('events');
var closest = require('closest');
var ItemList = require('../utils/itemlist');
var render = require('../rendervdom');
var debounce = require('debounce');
var resizable = require('resizable');
var store = require('../store').prefix('navigation');

module.exports = Navigation;

function Navigation() {
	Emitter.call(this);
	this.init();
	this.bind();
	this.ready = false;
}

Navigation.prototype = Object.create(Emitter.prototype);

Navigation.prototype.init = function Navigation_init() {
	var self = this;
	this.nav = {};
	this.redraw();
	this.el = this.nav.el;

	var roomList = this.roomList = new ItemList({
		template: 'roomlist.jade'
	});
	replace(qs('.rooms', this.el), roomList.el);

	var pmList = this.pmList = new ItemList({
		template: 'pmlist.jade'
	});
	replace(qs('.pms', this.el), pmList.el);

	var	navScrollbar = new Scrollbars(qs('.nav-wrap-out', this.el));
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		triggerRoomCreation: function (ev) {
			self.emit('triggerRoomCreation', closest(ev.target, 'div', true));
		},
		triggerRoomManager: function(ev) {
			if (self.ready) self.emit('triggerRoomManager');
		},
		triggerPMManager: function(ev) {
			if (self.ready) self.emit('triggerPMManager');
		},
	});
	this.events.bind('click .create-room', 'triggerRoomCreation');
	this.events.bind('click .manage-rooms-button', 'triggerRoomManager');
	this.events.bind('click .addpm', 'triggerPMManager');
};

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	lists.pms.sort(this.pmCompare);
	this.pmList.setItems(lists.pms);
	lists.rooms.sort(this.roomCompare);
	this.roomList.setItems(lists.rooms);
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
	this.pmList.selectItem(null);
	if (item.type === 'pm') {
		var pm = item.users[0];
		var isInList = this.pmList.items.indexOf(pm) > -1 ? true : false;
		if (!isInList) this.pmList.items.unshift(pm);
	}
	this[item.type + 'List'].selectItem(item);
};

Navigation.prototype.redraw = function Navigation_redraw() {
	render(this.nav, template('navigation.jade'));
	if (this.pmList) this.pmList.redraw();
	if (this.roomList) this.roomList.redraw();
};

Navigation.prototype.onNewMessage = function Navigation_onNewMessage(line) {
	var list = line.channel.type === 'pm' ? this.pmList : this.roomList;
	var item = line.channel.type === 'pm' ? line.channel.users[0] : line.channel;
	var itemIndex = list.items.indexOf(item);
	if (itemIndex == -1) return;

	list.items.splice(itemIndex, 1);
	list.items.unshift(item);
	list.redraw();
}

Navigation.prototype.deleteRoom = function Navigation_deleteRoom (room) {
	var newRoomIndex = this.roomList.items.indexOf(room);
	if (newRoomIndex == -1) return;
	this.roomList.items.splice(newRoomIndex, 1);
	this.roomList.redraw();
}

Navigation.prototype.onChannelRead = function Navigation_onChannelRead () {
	this.redraw();
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate () {
	this.roomList.redraw();
}

Navigation.prototype.onChangeUser = function Navigation_onChangeUser (user) {
	if (user == ui.user) return;
	var pmList = this.pmList;
	if (pmList.items.indexOf(user) == -1) pmList.items.push(user);
	pmList.redraw();
}

Navigation.prototype.onJoinedChannel = function Navigation_onJoinedChannel (room) {
	var joinedRoomIndex = this.roomList.items.indexOf(room);
	if (joinedRoomIndex > -1) return;
	this.roomList.items.push(room);
	this.roomList.redraw();
}

Navigation.prototype.onLeftChannel = function Navigation_onLeftChannel (room) {
	var newRoomIndex = this.roomList.items.indexOf(room);
	this.roomList.items.splice(newRoomIndex, 1);
	this.roomList.redraw();
}

Navigation.prototype.onUserMention = function Navigation_onUserMention () {
	this.roomList.redraw();
}

Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
	var rooms = org.rooms.slice();
	var pms = org.users.filter(function(user) {
		return user != ui.user && user.active && !user.is_only_invited;
	});
	this.setLists({ rooms: rooms, pms: pms });

	// we need this redraw for the organization logo
	// cause that is part of the navigation too
	this.redraw();
	this.ready = true;

	var sidebarWidth = store.get('sidebarWidth');
	var navResizable = new resizable(this.el, { directions: ['east'] });
	var chatContent = qs('.client-body');

	if (sidebarWidth) {
		chatContent.style.marginLeft = sidebarWidth + 'px';
		this.el.style.width = sidebarWidth + 'px';
	}

	var resizeClient = function resizeClient() {
		chatContent.style.marginLeft = this.el.clientWidth + 'px';
		store.set('sidebarWidth', this.el.clientWidth);
	}.bind(this);

	// the `orgReady` event is fired on reconnection as well
	// so we need to unbind the resizable and the window
	navResizable.element.removeEventListener('resize', resizeClient);
	window.removeEventListener('resize', resizeClient);
	
	// listening to the event fired by the resizable component
	navResizable.element.addEventListener('resize', resizeClient);
	window.addEventListener('resize', resizeClient);
}

