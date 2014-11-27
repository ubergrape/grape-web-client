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
	this.nav = {};
	this.redraw();
	this.el = this.nav.el;
	
	var roomList = this.roomList = new ItemList({template: 'roomlist', selector: '.item a'});
	replace(qs('.rooms', this.el), roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist', selector: '.item a'});
	replace(qs('.pms', this.el), pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist', selector: '.item a'});
	replace(qs('.labels', this.el), labelList.el);

	var roomScrollbar = new Scrollbars(qs('.rooms', this.el)),
			pmScrollbar = new Scrollbars(qs('.pms', this.el)),
			pmResizable = new resizable(qs('.pm-list', this.el), { directions: ['north'] });
			
	var resizeRoomList = debounce(function resizeRoomList() {
		var roomWrapper = roomScrollbar.wrapper.parentNode,
				heightDiff = pmResizable.element.scrollHeight - pmResizable._startH;
		roomWrapper.style.height = roomWrapper.scrollHeight - heightDiff + 'px';
	}, 500);
	
	pmResizable.element.addEventListener('resize', resizeRoomList);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

// route the events
Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		addroom: function (ev) { self.emit('addroom', closest(ev.target, 'a', true)); },
		addpm: function (ev) { self.emit('addpm', closest(ev.target, 'a', true)); },
	});
	this.events.bind('click .addroom', 'addroom');
	this.events.bind('click .addpm', 'addpm');
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
};

Navigation.prototype.select = function Navigation_select(which, item) {
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		self[which + 'List'].selectItem(null);
	});
	this[which + 'List'].selectItem(item);
};

// redraw everything, eg when the language changes
Navigation.prototype.redraw = function Navigation_redraw() {
	render(this.nav, template('navigation'));
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		if (self[which + 'List'])
		self[which + 'List'].redraw();
	});
};
