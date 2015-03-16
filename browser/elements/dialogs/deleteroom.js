/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Dialog = require('./dialog');

var events = require('events');
var qs = require('query');
var _ = require('t');

module.exports = DeleteRoomDialog;

function DeleteRoomDialog(context) {
	this.template_path = 'dialogs/deleteroom.jade';
	Dialog.call(this, context);
	this.button = qs('.delete', this.el);
	this.form = qs('.delete-room-form', this.el);
	if (this.form) this.passwordInput = this.form.password;
}

DeleteRoomDialog.prototype = Object.create(Dialog.prototype);

DeleteRoomDialog.prototype.bind = function DeleteRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.obj.submit = this.submit.bind(this);
	this.events.obj.resetvalidity = this.resetvalidity.bind(this);
	this.events.bind('submit .delete-room-form', 'submit');
	this.events.bind('input .password', 'resetvalidity');
};

DeleteRoomDialog.prototype.submit = function DeleteRoomDialog_submit(ev) {
	ev.preventDefault();
	var self = this;

	var password = self.passwordInput.value.trim();
	if (!password) {
		self.passwordInput.setCustomValidity(_("Please enter your password"));
		self.button.click();
		return;
	}

	self.emit('deleteroom', self.context.room, password, function DeleteRoomDialog_submit_callback(err, result){
		if(err) {
			self.passwordInput.setCustomValidity(err.details);
			self.button.click();
		} else {
			self.dialog.hide();
		}
	});
};

DeleteRoomDialog.prototype.resetvalidity = function DeleteRoomDialog_resetvalidity() {
	this.passwordInput.setCustomValidity('');
};

