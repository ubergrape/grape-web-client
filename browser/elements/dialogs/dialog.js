/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var dialog = require('dialog');
var v = require('virtualdom');
var template = require('template');


module.exports = Dialog;

function Dialog(context) {
	Emitter.call(this);
	this.context = context || {};
	var html = v.toDOM(template(this.template_path, context));
	this.dialog = dialog(html);
	this.el = this.dialog.el;
	this.bind();
	return this;
}

Dialog.prototype = Object.create(Emitter.prototype);

Dialog.prototype.bind = function Dialog_bind() {
	this.events = events(this.el, this);
};

// proxy for dialog
Dialog.prototype.closable = function Dialog_closable() {
	this.dialog.closable();
	return this;
};

// proxy for dialog
Dialog.prototype.show = function Dialog_show() {
	this.dialog.show();
	return this;
};

// proxy for dialog
Dialog.prototype.overlay = function Dialog_overlay() {
	this.dialog.overlay();
	return this;
};

