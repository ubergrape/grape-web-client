/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var events = require('events');
var dialog = require('dialog');
var qs = require('query');
var domify = require('domify');
var v = require('virtualdom');
var template = require('template');
var _ = require('t');


module.exports = MarkdownTipsDialog;

function MarkdownTipsDialog() {
	Emitter.call(this);
	var html = v.toDOM(template('markdowntips', this.context));
	this.dialog = dialog(html);
	this.el = this.dialog.el;
	this.bind();
	return this;
}

MarkdownTipsDialog.prototype = Object.create(Emitter.prototype);

MarkdownTipsDialog.prototype.bind = function MarkdownTipsDialog_bind() {
	this.events = events(this.el, this);
}

// proxy for dialog
MarkdownTipsDialog.prototype.closable = function MarkdownTipsDialog_closable() {
	this.dialog.closable();
	return this;
}

// proxy for dialog
MarkdownTipsDialog.prototype.show = function MarkdownTipsDialog_show() {
	this.dialog.show();
	return this;
}

// proxy for dialog
MarkdownTipsDialog.prototype.overlay = function MarkdownTipsDialog_overlay() {
	this.dialog.overlay();
	return this;
}

