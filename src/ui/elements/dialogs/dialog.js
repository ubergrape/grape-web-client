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
	this.init();
	this.bind();
	return this;
}

Dialog.prototype = Object.create(Emitter.prototype);

Dialog.prototype.init = function Dialog_init() {
	var vdom = v.toDOM(template(this.template_path, this.context));
	this.dialog = dialog(vdom);
	this.el = this.dialog.el;
};

Dialog.prototype.redraw = function Dialog_redraw() {
	// WARNING: this closes the dialog an removes classes that where added with
	// closable() and show() etc.
	this.init();
	this.bind();
};

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

