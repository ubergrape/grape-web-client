/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');

var events = require('events');
var closest = require('closest');
var domify = require('domify');

module.exports = ItemList;

function ItemList(options) {
	Emitter.call(this);
	this.template = options.template;
	this.selector = options.selector;
	this.items = [];
	this.itemIds = Object.create(null);
	this.selected = null;
	this.init();
	this.bind();
}

ItemList.prototype = Object.create(Emitter.prototype);

ItemList.prototype.init = function ItemList_init() {
	this.el = domify('<div class="itemlist"></div>');
	this.redraw();
};

ItemList.prototype.bind = function ItemList_bind() {
	var self = this;
	this.events = events(this.el, {
		additem: function () {
			self.emit('additem');
		},
		selectitem: function (ev) {
			var itemEl = closest(ev.target, '.item', true);
			var item = self.itemIds[itemEl.getAttribute('data-id')];
			self.emit('selectitem', item);
		}
	});
	this.events.bind('click .additem', 'additem');
	this.events.bind('click ' + this.selector, 'selectitem');
};

ItemList.prototype.redraw = function ItemList_redraw() {
	this.el.innerHTML = template(this.template, {
		items: this.items,
		selected: this.selected
	});
};

ItemList.prototype.setItems = function ItemList_setItems(items) {
	this.items = items;
	var ids = this.itemIds = Object.create(null);
	items.forEach(function (item) {
		ids[item.id] = item;
	});
	this.redraw();
};

ItemList.prototype.changedItem = function ItemList_changedItem(/*item*/) {
	this.redraw();
};

ItemList.prototype.selectItem = function ItemList_selectItem(item) {
	this.selected = item;
	this.redraw();
};

