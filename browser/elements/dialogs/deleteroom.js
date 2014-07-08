/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var dialog = require('dialog');
var domify = require('domify');
var v = require('virtualdom');
var template = require('template');
var _ = require('t');


module.exports = DeleteRoomDialog;

function DeleteRoomDialog(context) {
	Emitter.call(this);
	this.context = context || {};
	var html = v.toDOM(template('deleteroom', this.context));
	this.dialog = dialog(html);
	this.el = this.dialog.el;
	this.bind();
	return this.dialog;
}

DeleteRoomDialog.prototype = Object.create(Emitter.prototype);

DeleteRoomDialog.prototype.bind = function DeleteRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.bind('click .delete', 'submit');
}

DeleteRoomDialog.prototype.submit = function DeleteRoomDialog_submit() {
	debugger;
	ev.preventDefault();
	var password =  this.form['password'].value.trim();
	if (!password) return;
	this.emit('deleteroom', self.context['room'], password);
}
