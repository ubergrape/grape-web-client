var Dialog = require('./dialog');
var Menu = require('./menu');
var qs = require('query');

module.exports = RoomManager;

function RoomManager(context) {
	this.template_path = 'dialogs/roommanager.jade';
	Dialog.call(this, context);
}

RoomManager.prototype = Object.create(Dialog.prototype);
var protoInit = RoomManager.prototype.init;

RoomManager.prototype.init = function RoomManager_init() {
	var menu = new Menu({
		template: 'dialogs/menu.jade',
	});

	menu.setItems([
		{
			className: 'active-users',
			title: 'Active'
		},
		{
			className: 'invited-users',
			title: 'Invited'
		},
		{
			className: 'deleted-users',
			title: 'Deleted'
		}
	]);

	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	}

	protoInit.call(this);
	replace(qs('.manager-menu', this.dialog.el), menu.el);
}