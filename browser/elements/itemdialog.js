/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('dialog');
var Emitter = require('emitter');
var ItemList = require('./itemlist');

module.exports = ItemDialog;

function ItemDialog(options) {
	Emitter.call(this);
	this.init(options);
	this.bind();
}

ItemDialog.prototype = Object.create(Emitter.prototype);

ItemDialog.prototype.init = function ItemDialog_init(options) {
	this.itemList = new ItemList(options);
	this.dialog = new Dialog(this.itemList.el).effect('slide').closable();
	this.el = this.dialog.el; // expose for testing
};

ItemDialog.prototype.bind = function ItemDialog_bind() {
	var self = this;
	this.itemList.on('selectitem', function (item) {
		// TODO: automatically closing the dialog when this item changes the `joined`
		// flag is nice, but it might be *too* smart and not explicit enough?
		item.once('change joined', function () {
			self.hide();
		});
		self.emit('selectitem', item);
	});
};

ItemDialog.prototype.show = function ItemDialog_show() {
	this.dialog.overlay().show();
};

ItemDialog.prototype.hide = function ItemDialog_hide() {
	this.dialog.hide();
};

ItemDialog.prototype.redraw = function ItemDialog_redraw() {
	this.itemList.redraw();
};

ItemDialog.prototype.setItems = function ItemDialog_setItems(items) {
	this.itemList.setItems(items);
};

