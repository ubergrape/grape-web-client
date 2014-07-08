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


module.exports = DeleteRoomDialog;

function DeleteRoomDialog(context) {
	Emitter.call(this);
	this.context = context || {};
	var html = v.toDOM(template('deleteroom', this.context));
	this.dialog = dialog(html);
	this.el = this.dialog.el;
	this.form = qs('.delete-room-form', this.el);
	this.passwordInput = this.form['password'];
	this.button = qs('.delete', this.el);
	this.bind();
	return this.dialog;
}

DeleteRoomDialog.prototype = Object.create(Emitter.prototype);

DeleteRoomDialog.prototype.bind = function DeleteRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.obj.submit = this.submit.bind(this);
	this.events.obj.resetvalidity = this.resetvalidity.bind(this);
	this.events.bind('submit .delete-room-form', 'submit');
	this.events.bind('input .password', 'resetvalidity');
}

DeleteRoomDialog.prototype.submit = function DeleteRoomDialog_submit(ev) {
	ev.preventDefault();
	var self = this;

	var password = self.passwordInput.value.trim();
	if (!password) {
		self.passwordInput.setCustomValidity(_("Please enter your password"));
		self.button.click();
		return;
	}

	console.log("emitting deleteroom");
	self.emit('deleteroom', self.context['room'], password, function DeleteRoomDialog_submit_callback(err, result){
		console.log("callback called");
		if(err) {
			self.passwordInput.setCustomValidity(err.details);
			self.button.click()
		}else {
			alert("Deleted room " + self.context['room']);
			self.emit('selectchannel');
		}
	});
}

DeleteRoomDialog.prototype.resetvalidity = function DeleteRoomDialog_resetvalidity() {
	this.passwordInput.setCustomValidity('');
};

