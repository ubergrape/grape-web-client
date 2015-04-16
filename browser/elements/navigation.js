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
var store = require('../store').prefix('navigation');

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
	var roomList = this.roomList = new ItemList({template: 'roomlist.jade', selector: '.item a'});
	replace(qs('.rooms', this.el), roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist.jade', selector: '.item a'});
	replace(qs('.pms', this.el), pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist.jade', selector: '.item a'});
	replace(qs('.labels', this.el), labelList.el);

	this.filtering = false;

	var	roomScrollbar = new Scrollbars(qs('.rooms', this.el)),
		pmScrollbar = new Scrollbars(qs('.pms', this.el)),
		pmResizable = new resizable(qs('.pm-list', this.el), { directions: ['north'] });


	this.pmFilterEl = qs('.filter-pms', this.el);
	this.pmFilterEl.addEventListener('keyup', function(ev) {
		self.pmFilter();
	});

	// compute the height of the room list area
	// called every time the pm area is resized
	var resizeRoomList = debounce(function resizeRoomList() {
		var	totHeight = self.el.clientHeight,
			orgInfoHeight = qs('.org-info', self.el).clientHeight,
			roomWrapper = roomScrollbar.wrapper.parentNode,
			pmResizableHeight = pmResizable.element.clientHeight,
			remainingPadding = 12;
		// saving new sidebar height in localStorage
		store.set('pmListHeight', pmResizableHeight);
		roomWrapper.style.height = totHeight - orgInfoHeight - pmResizableHeight - remainingPadding + 'px';
	}, 200);


	// listening to the event fired by the resizable in the resize
	// method in the resizable component (our ubergrape fork)
	pmResizable.element.addEventListener('resize', resizeRoomList);
	
	// if the pm list height in not saved in localStorage,
	// the height will fall back to the default one (25%)
	pmResizable.element.style.height = store.get('pmListHeight') + 'px';
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
	var self = this;

	lists.pms.sort(this.pmCompare);

	['room', 'pm', 'label'].forEach(function (which) {
		if (lists[which + 's'])
			self[which + 'List'].setItems(lists[which + 's']);
	});

	// we need this for filtering
	self.pmList.unfiltered = self.pmList.items;
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
	var	self 	= this,
		which	= item.type;	
	['room', 'pm', 'label'].forEach(function (which) {
		self[which + 'List'].selectItem(null);
	});
	this[which + 'List'].selectItem(item);
};

Navigation.prototype.newMessage = function Navigation_newMessage(line) {
	if (this.filtering || line.channel.type != 'pm') return;
	var pmPartnerIndex = this.pmList.items.indexOf(line.channel.users[0]);
	if (pmPartnerIndex == -1) return;
	this.pmList.items.splice(pmPartnerIndex, 1);
	this.pmList.items.unshift(line.channel.users[0]);
	this.pmList.redraw();
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

Navigation.prototype.deleteUser = function Navigation_deleteUser(item) {
	// TODO unbind events
	if (this.filtering) return;
	var itemIndex = this.pmList.items.indexOf(item);
	this.pmList.items.splice(itemIndex, 1);
	this.pmList.redraw();
};

Navigation.prototype.deleteRoom = function Navigation_deleteRoom() {
	this.roomList.redraw();
}

Navigation.prototype.hasRead = function Navigation_hasRead(room) {
	if (this.filtering || room.type != "pm") return;
	// we just need this for the pm list, not the room list
	// the room list is listening to changes in its items and redrawing
	// the pm is not listening to changes in its pm object, so
	// we need to manually redraw 
	// TODO redisign this, since the room list is also redrawn 
	// every time someone type anything and that is not expected
	this.pmList.redraw();
}

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
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		if (self[which + 'List'])
		self[which + 'List'].redraw();
	});
};

Navigation.prototype.onOrgReady = function Navigation_onOrgReady() {
	this.redraw();
}
