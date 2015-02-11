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
	var roomList = this.roomList = new ItemList({template: 'roomlist.jade', selector: '.item a'});
	replace(qs('.rooms', this.el), roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist.jade', selector: '.item a'});
	replace(qs('.pms', this.el), pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist.jade', selector: '.item a'});
	replace(qs('.labels', this.el), labelList.el);

	this.filtering = false;

	var roomScrollbar = new Scrollbars(qs('.rooms', this.el)),
			pmScrollbar = new Scrollbars(qs('.pms', this.el)),
			pmResizable = new resizable(qs('.pm-list', this.el), { directions: ['north'] });


	this.pmFilterEl = qs('.filter-pms', this.el);
	this.pmFilterEl.addEventListener('keyup', function(ev) {
		self.pmFilter();
	});

	// compute the height of the room list area
	// called every time the pm area is resized
	var resizeRoomList = debounce(function resizeRoomList() {
		var totHeight = self.el.clientHeight,
				orgInfoHeight = qs('.org-info', self.el).clientHeight,
				roomWrapper = roomScrollbar.wrapper.parentNode,
				pmResizableHeight = pmResizable.element.clientHeight,
				remainingPadding = 15;

		roomWrapper.style.height = totHeight - orgInfoHeight - pmResizableHeight - remainingPadding + 'px';
	}, 200);

	// listening to the event fired by the resizable in the resize
	// method in the resizable component (our ubergrape fork)
	pmResizable.element.addEventListener('resize', resizeRoomList);
	// need this on load too
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
		addroom: function (ev) { self.emit('addroom', closest(ev.target, 'a', true)); }
	});
	this.events.bind('click .addroom', 'addroom');
	['room', 'pm', 'label'].forEach(function (which) {
		self[which + 'List'].on('selectitem', function (item) {
			self.emit('select' + which, item);
		});
	});
};

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	var self = this;

	['room', 'pm', 'label'].forEach(function (which) {
		if (lists[which + 's'])
			self[which + 'List'].setItems(lists[which + 's']);
	});
	
	self.orderPmItems();
	
	function bindPm(user) {
		if (user.pm !== null && typeof user.pm !== "undefined" && typeof user.pm.on !== "undefined") {
			user.pm.on('change', function() {
				self.orderPmItems();
			});
		}
	}
	// the pm list ist actually a list of users
	self.pmList.items.forEach(function(user) {
		bindPm(user);
		user.on('change', function() {
			self.orderPmItems();
		});
	});

	// we need this for filtering
	self.pmList.unfiltered = self.pmList.items;
};

Navigation.prototype.orderPmItems = function Navigation_orderPmItems() {
	this.pmList.items.sort(this.pmCompare);
	this.pmList.redraw();
}

Navigation.prototype.select = function Navigation_select(which, item) {
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		self[which + 'List'].selectItem(null);
	});
	this[which + 'List'].selectItem(item);
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

Navigation.prototype.pmCompare = function Navigation_pmCompare(a, b) {
	
	function getStatusValue(user) {
		if (!user.active) return 0
		if (user.status == 16) return 3
		if (user.is_only_invited) return 1
		return 2
	}

	var aLastMessage = a.pm ? a.pm.latest_message_time : 0;
	var bLastMessage = b.pm ? b.pm.latest_message_time : 0;
	if (getStatusValue(a) != getStatusValue(b))
		return getStatusValue(b) - getStatusValue(a)
	else 
		return bLastMessage - aLastMessage
}

Navigation.prototype.deleteUser = function Navigation_deleteUser(item) {
	// TODO unbind events
	if (!this.filtering) {
		var itemIndex = this.pmList.items.indexOf(item);
		this.pmList.items.splice(itemIndex, 1);
		this.pmList.redraw();
	}
};

Navigation.prototype.pmFilter = function Navigation_pmFilter() {
	var self = this;
	var str = self.pmFilterEl.value;

	console.log("filter for", str);

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
