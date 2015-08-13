var Dialog = require('./dialog');
var Menu = require('./menu');
var qs = require('query');
var events = require('events');

module.exports = RoomManager;

function RoomManager (context) {
	this.template_path = 'dialogs/roommanager.jade';
	Dialog.call(this, context);
}

RoomManager.prototype = Object.create(Dialog.prototype);
var protoInit = RoomManager.prototype.init;

RoomManager.prototype.init = function () {
	var menu = this.menu = new Menu({
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

RoomManager.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('click .active-users', 'setActive');
	this.events.bind('click .invited-users', 'setInvited');
	this.events.bind('click .deleted-users', 'setDeleted');
}

RoomManager.prototype.setActive = function () {
	var menu = this.menu;
	menu.selectItem(null);
	menu.selectItem(menu.items[0]);
}

RoomManager.prototype.setInvited = function () {
	var menu = this.menu;
	menu.selectItem(null);
	menu.selectItem(menu.items[1]);
}

RoomManager.prototype.setDeleted = function () {
	var menu = this.menu;
	menu.selectItem(null);
	menu.selectItem(menu.items[2]);
}