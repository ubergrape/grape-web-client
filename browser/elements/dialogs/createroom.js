var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');

module.exports = CreateRoomDialog;

function CreateRoomDialog() {
	this.template_path = 'dialogs/createroom.jade';
	Dialog.call(this);
	this.form = qs('form.create-room-form', this.el);
	this.newRoomName = this.form['newroom-name'];
	this.createButton = qs('input.create', this.form);
}

CreateRoomDialog.prototype = Object.create(Dialog.prototype);

CreateRoomDialog.prototype.bind = function CreateRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.obj.close = this.close;
	this.events.obj.createRoom = function(e) {
		e.preventDefault();
		var	isPublic = qs('input:checked', this.form).value == "false" ? false : true,
			room = {
				'name': this.newRoomName.value.trim(),
				'is_public': isPublic
			};
		this.emit('createroom', room, function(err) {
			if (err) this.errorFeedback(err);
		}.bind(this));
	}
	this.events.obj.resetValidity = function() {
		this.newRoomName.setCustomValidity('');
	}
	this.events.bind('click input[type="reset"]', 'close');
	this.events.bind('keyup input#newroom-name', 'resetValidity');
	this.events.bind('submit form.create-room-form', 'createRoom');
}

CreateRoomDialog.prototype.close = function CreateRoomDialog_close() {
	this.dialog.hide();
}

CreateRoomDialog.prototype.roomNameFocus = function CreateRoomDialog_roomNameFocus() {
	this.newRoomName.focus();
}

CreateRoomDialog.prototype.errorFeedback = function CreateRoomDialog_errorFeedback(err) {
	this.newRoomName.setCustomValidity(err.name[0].message);
	this.createButton.click();
}