/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var ItemList = require('./itemlist');
var broker = require('broker');
var qs = require('query');
var events = require('events');

module.exports = ItemPopover;

function ItemPopover(options) {
	Emitter.call(this);
	this.init(options);
	this.bind();
}

ItemPopover.prototype = Object.create(Emitter.prototype);

ItemPopover.prototype.init = function ItemPopover_init(options) {
	this.attach = options.attach;
	this.itemList = new ItemList(options);
	this.el = document.createElement('div');
	this.el.className = 'popover hide';
	this.el.appendChild(this.itemList.el);
	this.hidden = true;
};

ItemPopover.prototype.bind = function ItemPopover_bind() {
	var self = this;
	this.events = events(this.el, {
		close: function () {
			self.hide();
		}
	});
	this.events.bind('click .close', 'close');
	document.addEventListener('click', function (ev) {
		var trigger = qs(self.attach[1], self.attach[0]);
		if (self.hidden) return;
		var target = ev.target;
		var parent = target;
		do {
			if (parent === self.el || parent === trigger) return;
		} while ((parent = parent.parentNode));
		self.hide();
	});
	broker.pass(this.itemList, 'selectitem', this, 'selectitem');
};

ItemPopover.prototype.show = function ItemPopover_show() {
	this.el.className = 'popover';
	var target = qs(this.attach[1], this.attach[0]);
	var offset = target.getBoundingClientRect();
	this.el.style.top = offset.top + 'px';
	this.el.style.left = offset.left + offset.width + 'px';
	document.body.appendChild(this.el);
	this.hidden = false;
};

ItemPopover.prototype.hide = function ItemPopover_hide() {
	this.el.className = 'popover hide';
	this.el.parentNode.removeChild(this.el);
	this.hidden = true;
};

ItemPopover.prototype.redraw = function ItemPopover_redraw() {
	this.itemList.redraw();
};

ItemPopover.prototype.setItems = function ItemPopover_setItems(items) {
	this.itemList.setItems(items);
};

