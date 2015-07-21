/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');

module.exports = MarkdownTipsDialog;

function MarkdownTipsDialog() {
	this.template_path = 'dialogs/markdowntips.jade';
	Dialog.call(this);
}

MarkdownTipsDialog.prototype = Object.create(Dialog.prototype);
