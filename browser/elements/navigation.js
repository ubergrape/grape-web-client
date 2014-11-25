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

module.exports = Navigation;

function Navigation() {
	Emitter.call(this);
	this.init();
	this.bind();
}

Navigation.prototype = Object.create(Emitter.prototype);

Navigation.prototype.init = function Navigation_init() {
	// biderectional bindings, once redrawn 
	// this nav will become the drawn element
	this.nav = {};
	this.redraw();
	
	// this is the actual DOM element `nav`
	var el = this.nav.el;

	// XXX: this is a bit weird :-(
	var navWrapper = document.createElement('div');
	navWrapper.setAttribute("class", "navigation");
	navWrapper.appendChild(el);
	// var scr = new Scrollbars(el);
	// this.el = scr.wrapper;
	this.el = el.parentNode;
	console.log(this.el);
	 
	// initialize the sub lists
	var roomList = this.roomList = new ItemList({template: 'roomlist', selector: '.item a'});
	replace(qs('.rooms', el), roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist', selector: '.item a'});
	replace(qs('.pms', el), pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist', selector: '.item a'});
	replace(qs('.labels', el), labelList.el);
	
	var myResizable = new resizable(qs('.pm-list', el), {
	    directions: ['north']
	});

};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

// route the events
Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	this.events = events(this.el, {
		addroom: function (ev) { self.emit('addroom', closest(ev.target, 'a', true)); },
		addpm: function (ev) {
			self.emit('addpm', closest(ev.target, 'a', true));
			console.log('yuppy');
		},
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
