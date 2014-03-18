/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('dialog');
var Emitter = require('emitter');
var ItemList = require('./itemlist');
var broker = require('broker');

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
	broker.pass(this.itemList, 'selectitem', this, 'selectitem');
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

