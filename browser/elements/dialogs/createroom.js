var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');

module.exports = CreateRoomDialog;

function CreateRoomDialog() {
	this.template_path = 'dialogs/createroom.jade';
	Dialog.call(this);
	this.form = qs('form.create-room-form', this.el);
	this.newRoomName = this.form['newroom-name'];
}

CreateRoomDialog.prototype = Object.create(Dialog.prototype);

CreateRoomDialog.prototype.bind = function CreateRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.obj.close = this.close;
	this.events.obj.createroom = function(e) {
		e.preventDefault();
		var	isPublic = qs('input:checked', this.form).value == "false" ? false : true,
			room = {
				'name': this.newRoomName.value.trim(),
				'is_public': isPublic
			};
		this.emit('createroom', room);
	}
	this.events.bind('click input[type="reset"]', 'close');
	this.events.bind('submit form.create-room-form', 'createroom');
}

CreateRoomDialog.prototype.close = function CreateRoomDialog_close() {
	this.dialog.hide();
}

CreateRoomDialog.prototype.show = function CreateRoomDialog_show() {
	this.dialog.show();
	this.newRoomName.focus();
	return this;
}