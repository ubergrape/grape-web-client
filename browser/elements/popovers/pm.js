/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var ItemList = require('../itemlist');
var Popover = require('./popover');
var broker = require('broker');

module.exports = PMPopover;

function PMPopover() {
	Popover.call(this);
}

PMPopover.prototype = Object.create(Popover.prototype);

PMPopover.prototype.init = function PMPopover_init() {
	Popover.prototype.init.call(this);
	this.classes.add('item-po');
	this.classes.add('left');
	this.itemList = new ItemList({template: 'popovers/pm.jade', selector: '.item'});
	this.el.appendChild(this.itemList.el);
};

PMPopover.prototype.bind = function PMPopover_bind() {
	Popover.prototype.bind.call(this);
	broker.pass(this.itemList, 'selectitem', this, 'selectitem');
};

PMPopover.prototype.redraw = function PMPopover_redraw() {
	this.itemList.redraw();
};

PMPopover.prototype.setItems = function PMPopover_setItems(items) {
	this.itemList.setItems(items);
};

