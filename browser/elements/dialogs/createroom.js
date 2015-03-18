var Dialog = require('./dialog');
var events = require('events');
var qs = require('query');

module.exports = CreateRoomDialog;

function CreateRoomDialog() {
	this.template_path = 'dialogs/createroom.jade';
	Dialog.call(this);
	this.form = qs('form.create-room-form', this.el);
}

CreateRoomDialog.prototype = Object.create(Dialog.prototype);

CreateRoomDialog.prototype.bind = function CreateRoomDialog_bind() {
	this.events = events(this.el, this);
	
	this.events.obj.close = this.close;
	this.events.obj.createroom = function(e) {
		e.preventDefault();
		var room = {
			'name': this.form['newroom-name'].value.trim(),
			'is_public': qs('input:checked', this.form).value
		};
		this.emit('createroom', room);
	}

	this.events.bind('click input[type="reset"]', 'close');
	this.events.bind('submit form.create-room-form', 'createroom');
}

CreateRoomDialog.prototype.close = function CreateRoomDialog_close() {
	this.dialog.hide();
}