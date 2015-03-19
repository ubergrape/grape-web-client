var Dialog = require('./dialog');
var events = require('events');

module.exports = CreateRoomDialog;

function CreateRoomDialog() {
	this.template_path = 'dialogs/createroom.jade';
	Dialog.call(this);
}

CreateRoomDialog.prototype = Object.create(Dialog.prototype);

CreateRoomDialog.prototype.bind = function CreateRoomDialog_bind() {
	this.events = events(this.el, this);
	this.events.obj.close = function() {
		this.dialog.hide();
	}.bind(this);
	this.events.bind('click input[type="reset"]', 'close');
}