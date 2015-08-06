/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');

module.exports = InviteDialog;

function InviteDialog(context) {
	this.template_path = 'dialogs/invite.jade';
	Dialog.call(this, context);
}

InviteDialog.prototype = Object.create(Dialog.prototype);

InviteDialog.prototype.bind = function InviteDialog_bind() {

};