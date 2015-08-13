var Dialog = require('./dialog');
var Menu = require('./menu');
var ItemList = require('../itemlist');
var qs = require('query');
var events = require('events');

module.exports = RoomManager;

function RoomManager (context) {
	this.template_path = 'dialogs/roommanager.jade';
	this.mode = 'unjoined';
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
			className: 'rooms-to-join',
			title: 'Rooms to join'
		},
		{
			className: 'joined-rooms',
			title: 'Joined rooms'
		},
		{
			className: 'new-room',
			title: 'New room'
		}
	]);

	var roomList = this.roomList = new ItemList({
		template: 'dialogs/roomlist.jade',
		templateOptions: {
			mode: this.mode
		}
	});
	roomList.setItems(this.context.rooms);

	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	}

	protoInit.call(this);
	replace(qs('.manager-menu', this.dialog.el), menu.el);
	replace(qs('ul', this.dialog.el), roomList.el);
}

RoomManager.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('click .rooms-to-join', 'setUnjoined');
	this.events.bind('click .joined-rooms', 'setJoined');
	this.events.bind('click .new-room', 'setCreate');
}

RoomManager.prototype.setUnjoined = function () {
	var menu = this.menu;
	var roomList = this.roomList;
	menu.selectItem(null);
	menu.selectItem(menu.items[0]);
	this.mode = roomList.templateOptions.mode = 'unjoined';
	roomList.redraw();
}

RoomManager.prototype.setJoined = function () {
	var menu = this.menu;
	var roomList = this.roomList;
	menu.selectItem(null);
	menu.selectItem(menu.items[1]);
	this.mode = roomList.templateOptions.mode = 'joined';
	roomList.redraw();
}

RoomManager.prototype.setCreate = function () {
	var menu = this.menu;
	var roomList = this.roomList;
	menu.selectItem(null);
	menu.selectItem(menu.items[2]);
	this.mode = roomList.templateOptions.mode = 'creation';
	roomList.redraw();
}