var Dialog = require('./dialog');

module.exports = CreateRoomDialog;

function CreateRoomDialog() {
	this.template_path = 'dialogs/createroom.jade';
	Dialog.call(this);
}

CreateRoomDialog.prototype = Object.create(Dialog.prototype);