/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('emitter');
var broker = require('broker');
var qs = require('query');
var template = require('template');

var ItemList = require('./itemlist');
var Popover = require('./popover');
var render = require('../rendervdom');

module.exports = RoomPopover;

function RoomPopover() {
	this.init();
	this.bind();
}

RoomPopover.prototype = Object.create(Popover.prototype);
emitter(RoomPopover.prototype);

RoomPopover.prototype.init = function RoomPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.el.appendChild(this.content.el);
	this.itemList = new ItemList({template: 'roompopoverlist', selector: '.toggle'});
	replace(qs('ul', this.el), this.itemList.el);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

RoomPopover.prototype.bind = function RoomPopover_bind() {
	Popover.prototype.bind.call(this);
	broker.pass(this.itemList, 'selectitem', this, 'selectitem');
};

RoomPopover.prototype.redraw = function RoomPopover_redraw() {
	render(this.content, template('roompopover'));
	if (this.itemList)
		this.itemList.redraw();
};

RoomPopover.prototype.setItems = function RoomPopover_setItems(items) {
	this.itemList.setItems(items);
};

