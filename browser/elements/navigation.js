/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');
var template = require('template');
var qs = require('query');
var events = require('events');

var ItemList = require('./itemlist');
var render = require('../rendervdom');

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
	var el = this.nav.el;

	// XXX: this is a bit weird :-(
	document.createElement('div').appendChild(el);
	var scr = new Scrollbars(el);
	this.el = scr.wrapper;

	// initialize the sub lists
	var roomList = this.roomList = new ItemList({template: 'roomlist'});
	replace(qs('.rooms', el), roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist', selector: '.item .name, .item .avatar, .item .unread'});
	replace(qs('.pms', el), pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist', selector: '.item .label'});
	replace(qs('.labels', el), labelList.el);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

// route the events
Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		addroom: function (ev) { self.emit('addroom', ev.target); },
		addpm: function (ev) { self.emit('addpm', ev.target); },
		//addroom: function () { self.emit('addroom'); },
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
