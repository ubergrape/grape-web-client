var Dialog = require('./dialog');
var Menu = require('./menu');
var ItemList = require('../itemlist');
var qs = require('query');
var events = require('events');
var closest = require('closest');
var template = require('template');
var render = require('../../rendervdom');

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
		header: 'Manage Rooms',
		tabs: {
			visible: true
		},
		back: {
			className: 'back-button',
			visible: false
		},
		button: {
			className: 'new-room',
			text: 'Create new room',
			visible: true
		}
	});

	menu.setTabs([
		{
			className: 'rooms-to-join',
			title: 'Join rooms'
		},
		{
			className: 'joined-rooms',
			title: 'Manage your rooms'
		}
	]);


	var roomList = this.roomList = new ItemList({
		template: 'dialogs/roomlist.jade',
		templateOptions: {
			mode: this.mode
		}
	});
	roomList.setItems(this.context.rooms);
	roomList.order('name');

	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	}
	this.creationForm = {};
	this.redrawCreationForm();
	protoInit.call(this);
	replace(qs('.manager-menu', this.dialog.el), menu.el);
	replace(qs('ul', this.dialog.el), roomList.el);
	replace(qs('form', this.dialog.el), this.creationForm.el);
}

RoomManager.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('click .rooms-to-join', 'setUnjoined');
	this.events.bind('click .joined-rooms', 'setJoined');
	this.events.bind('click .new-room', 'setCreate');
	this.events.bind('click li.leave', 'leaveRoom');
	this.events.bind('submit form.create-room-form', 'createRoom');
	this.events.bind('keydown input#newroom-name', 'resetValidity');
	this.events.bind('click .back-button', 'setUnjoined');
}

RoomManager.prototype.setUnjoined = function () {
	var menuOptions = this.menu.options;
	this.mode = this.roomList.templateOptions.mode = 'unjoined';
	menuOptions.back.visible = false;
	menuOptions.button.visible = true;
	menuOptions.tabs.visible = true;
	menuOptions.header = 'Manage Rooms';
	this.redrawContent(0);
}

RoomManager.prototype.setJoined = function () {
	var menuOptions = this.menu.options;
	this.mode = this.roomList.templateOptions.mode = 'joined';
	menuOptions.back.visible = false;
	menuOptions.button.visible = true;
	menuOptions.tabs.visible = true;
	menuOptions.header = 'Manage Rooms';
	this.redrawContent(1);
}

RoomManager.prototype.setCreate = function () {
	var menuOptions = this.menu.options;
	this.mode = this.roomList.templateOptions.mode = 'creation';
	menuOptions.back.visible = true;
	menuOptions.button.visible = false;
	menuOptions.tabs.visible = false;
	menuOptions.header = 'Create new room';
	this.redrawContent(2);
}

RoomManager.prototype.leaveRoom = function (ev) {
	var roomID = closest(ev.target, '.item', true).getAttribute('data-id');
	this.emit('leaveRoom', roomID);	
}

RoomManager.prototype.createRoom = function (ev) {
	ev.preventDefault();
	var form = this.creationForm.el;
	var newRoomName = form['newroom-name'];
	var room = {
		'name': newRoomName.value.trim(),
		'is_public': qs('input:checked', form).value
	};
	this.emit('createRoom', room);
}

RoomManager.prototype.redrawCreationForm = function (ev) {
	render(this.creationForm, template('dialogs/room-creation-form.jade', {
		mode: this.mode
	}));
}

RoomManager.prototype.redrawContent = function (selected) {
	var menu = this.menu;
	menu.selectTab(null);
	menu.selectTab(menu.options.tabs.items[selected]);
	menu.redraw();
	this.roomList.order('name');
	this.redrawCreationForm();
}

RoomManager.prototype.resetValidity = function () {
	var newRoomName = this.creationForm.el['newroom-name'];
	newRoomName.setCustomValidity('');
}

RoomManager.prototype.onLeftChannel = function () {
	this.roomList.redraw();
}

RoomManager.prototype.onJoinedChannel = function () {
	this.roomList.redraw();
}

RoomManager.prototype.onNewRoom = function () {
	this.roomList.redraw();
}

RoomManager.prototype.onChannelUpdate = function () {
	this.roomList.redraw();
}

RoomManager.prototype.onRoomCreationError = function (err) {
	var form = this.creationForm.el;
	var newRoomName = form['newroom-name'];
	var createButton = qs('input.create-room-button', form);
	newRoomName.setCustomValidity(err.msg);
	createButton.click();	
}

RoomManager.prototype.onEndRoomCreation = function () {
	// yes, this is how we can close the dialog - HACK
	qs('.close', this.el).click();
}