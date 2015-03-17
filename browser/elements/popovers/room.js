/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');
var qs = require('query');
var template = require('template');
var classes = require('classes');

var ItemList = require('../itemlist');
var Popover = require('./popover');
var render = require('../../rendervdom');

module.exports = RoomPopover;

function RoomPopover() {
	Popover.call(this);
}

RoomPopover.prototype = Object.create(Popover.prototype);

RoomPopover.prototype.init = function RoomPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.itemList = new ItemList({template: 'popovers/roomlist.jade', selector: '.toggle'});
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
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/room.jade'));
	if (this.itemList) this.itemList.redraw();
};

RoomPopover.prototype.setItems = function RoomPopover_setItems(items) {
	this.itemList.setItems(items);
};

RoomPopover.prototype.newRoom = function RoomPopover_newRoom() {
	this.redraw();
}

