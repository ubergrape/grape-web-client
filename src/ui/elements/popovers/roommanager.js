/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var qs = require('query');
var template = require('template');
var classes = require('classes');
var ItemList = require('../itemlist');
var Popover = require('./popover');
var render = require('../../rendervdom');
var closest = require('closest');


module.exports = RoomManagerPopover;

function RoomManagerPopover() {
	Popover.call(this);
}

RoomManagerPopover.prototype = Object.create(Popover.prototype);

RoomManagerPopover.prototype.init = function RoomManagerPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.tabSelection = 'unjoined';
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.itemList = new ItemList({
		template: 'popovers/roomlist.jade',
		selector: '.toggle',
		templateOptions: {
			tabSelection: this.tabSelection
		}
	});
	replace(qs('ul', this.el), this.itemList.el);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

RoomManagerPopover.prototype.bind = function RoomManagerPopover_bind() {
	Popover.prototype.bind.call(this);
	var self = this;

	this.events.obj.leaveRoom = function(e) {
		var roomID = closest(e.target, '.item', true).getAttribute('data-id');
		self.emit('leaveroom', roomID);
	};
	this.events.obj.setJoinedList = function(e) {
		self.tabSelection = 'joined';
		self.itemList.templateOptions.tabSelection = self.tabSelection;
		self.redraw();
	};
	this.events.obj.setUnjoinedList = function(e) {
		self.tabSelection = 'unjoined';
		self.itemList.templateOptions.tabSelection = self.tabSelection;
		self.redraw();
	};
	this.events.obj.triggerRoomCreation = function(e) {
		self.tabSelection = 'creation';
		self.redraw();
	}
	this.events.obj.createRoom = function(e) {
		e.preventDefault();
		var form = qs('form.create-room-form', this.el);
		var newRoomName = form['newroom-name'];
		var room = {
			'name': newRoomName.value.trim(),
			'is_public': qs('input:checked', form).value
		};
		self.emit('createroom', room);
	};
	this.events.obj.resetValidity = function() {
		var form = qs('form.create-room-form', this.el);
		var newRoomName = form['newroom-name'];
		newRoomName.setCustomValidity('');
	};
	this.events.obj.cancel = function () {
		self.end();
	};

	this.events.bind('click li.leave', 'leaveRoom');
	this.events.bind('click a.rooms-to-join', 'setUnjoinedList');
	this.events.bind('click a.joined-rooms', 'setJoinedList');
	this.events.bind('click a.new-room', 'triggerRoomCreation');
	this.events.bind('submit form.create-room-form', 'createRoom');
	this.events.bind('click input.back', 'cancel');
	this.events.bind('keydown input#newroom-name', 'resetValidity');
};

RoomManagerPopover.prototype.onTriggerRoomCreation = function RoomManagerPopover_onTriggerRoomCreation (target) {
	this.tabSelection = 'creation';
	this.redraw();
	this.toggle(target);
}

RoomManagerPopover.prototype.redraw = function RoomManagerPopover_redraw() {
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/roommanager.jade', {
		tabSelection: this.tabSelection
	}));
	if (this.itemList) this.itemList.redraw();
};

RoomManagerPopover.prototype.onMemberLeftChannel = function RoomManagerPopover_onMemberLeftChannel (room) {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onNewRoomMember = function RoomManagerPopover_onNewRoomMember() {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onNewRoom = function RoomManagerPopover_onNewRoom() {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onChannelUpdate = function RoomManagerPopover_onChannelUpdate() {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onRoomDeleted = function RoomManagerPopover_onRoomDeleted() {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onJoinedChannel = function RoomManagerPopover_onJoinedChannel() {
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onLeftChannel = function RoomManagerPopover_onLeftChannel (room) {
	if (!room.is_public) {
		var roomIndex = this.itemList.items.indexOf(room);
		this.itemList.items.splice(roomIndex, 1);
	}	
	this.itemList.redraw();
}

RoomManagerPopover.prototype.onTriggerRoomManager = function RoomManagerPopover_onTriggerRoomManager (target) {
	this.tabSelection = 'unjoined';
	this.itemList.templateOptions.tabSelection = this.tabSelection;
	this.redraw();
	this.toggle(target);
}

RoomManagerPopover.prototype.onOrgReady = function RoomManagerPopover_onOrgReady(org) {
	this.itemList.setItems(org.rooms);
}

RoomManagerPopover.prototype.errorFeedback = function RoomCreationPopover_errorFeedback(err) {
	var form = qs('form.create-room-form', this.el);
	var newRoomName = form['newroom-name'];
	var createButton = qs('input.create', form);
	newRoomName.setCustomValidity(err.msg);
	createButton.click();
}

RoomManagerPopover.prototype.end = function RoomCreationPopover_end() {
	this.hide();
}