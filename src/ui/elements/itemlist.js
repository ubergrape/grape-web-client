/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var events = require('events');
var render = require('../rendervdom');

module.exports = ItemList;

function ItemList(options) {
	Emitter.call(this);
	this.template = options.template;
	this.selector = options.selector + ', .item .name, .item .icon, .item .unread, .item .room-info, .item';
	this.parameters = options.parameters ? options.parameters : null;
	this.items = [];
	this.selected = null;
	this.redraw = this.redraw.bind(this);
	this.redraw();
}

ItemList.prototype = Object.create(Emitter.prototype);

ItemList.prototype.redraw = function ItemList_redraw() {
	var vdom = template(this.template, {
		items: this.items,
		selected: this.selected,
		parameters: this.parameters
	});
	render(this, vdom);
};

ItemList.prototype.setItems = function ItemList_setItems(items) {
	var self = this;
	this.selected = null;
	this.items = items;
	this.redraw();
};

ItemList.prototype.selectItem = function ItemList_selectItem(item) {
	this.selected = item;
	this.redraw();
};

