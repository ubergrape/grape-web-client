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
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.itemList = new ItemList({
		template: 'popovers/roomlist.jade',
		selector: '.toggle'
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

	this.events.bind('click li.leave', 'leaveRoom');
};

RoomManagerPopover.prototype.redraw = function RoomManagerPopover_redraw() {
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/roommanager.jade'));
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
	this.toggle(target);
}

RoomManagerPopover.prototype.setItems = function RoomManagerPopover_setItems(items) {
	this.itemList.setItems(items);
};

RoomManagerPopover.prototype.onOrgReady = function RoomManagerPopover_onOrgReady(org) {
	this.setItems(org.rooms);
}