var dialog = require('dialog');
var domify = require('domify');
var v = require('virtualdom');
var template = require('template');


module.exports = DeleteRoomDialog;

function DeleteRoomDialog(context) {
	var context = context || {};
	var html = v.toDOM(template('deleteroom', context));
	var d = dialog("really?", html);
	return d;
}
