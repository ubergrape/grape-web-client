/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('dialog');
var Emitter = require('emitter');
var ItemList = require('./itemlist');

module.exports = RoomDialog;

function RoomDialog() {
	Emitter.call(this);
	this.init();
	this.bind();
}

RoomDialog.prototype = Object.create(Emitter.prototype);

RoomDialog.prototype.init = function RoomDialog_init() {
	this.itemList = new ItemList({template: 'roomdialog', selector: '.item'});
	this.dialog = new Dialog(this.itemList.el).overlay().closable();
	this.el = this.dialog.el; // expose for testing
};

RoomDialog.prototype.bind = function RoomDialog_bind() {
	var self = this;
	this.itemList.on('selectitem', function (room) {
		// TODO: automatically closing the dialog when this room changes the `joined`
		// flag is nice, but it might be *too* smart and not explicit enough?
		room.once('change joined', function () {
			self.hide();
		});
		self.emit('selectroom', room);
	});
};

RoomDialog.prototype.show = function RoomDialog_show() {
	this.dialog.show();
};

RoomDialog.prototype.hide = function RoomDialog_hide() {
	this.dialog.hide();
};

RoomDialog.prototype.redraw = function RoomDialog_redraw() {
	this.itemList.redraw();
};

RoomDialog.prototype.setRooms = function RoomDialog_setRooms(rooms) {
	this.itemList.setItems(rooms);
};

