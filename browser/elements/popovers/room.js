/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var qs = require('query');
var template = require('template');
var classes = require('classes');
var ItemList = require('../itemlist');
var Popover = require('./popover');
var render = require('../../rendervdom');
var closest = require('closest');


module.exports = RoomPopover;

function RoomPopover() {
	Popover.call(this);
}

RoomPopover.prototype = Object.create(Popover.prototype);

RoomPopover.prototype.init = function RoomPopover_init() {
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

RoomPopover.prototype.bind = function RoomPopover_bind() {
	Popover.prototype.bind.call(this);
	var self = this;

	this.events.obj.leaveRoom = function(e) {
		var roomID = closest(e.target, '.item', true).getAttribute('data-id');
		self.emit('leaveroom', roomID);
	};

	function setRoomCreation() {
		self.events.obj.toggleRoomCreation = function() {
			self.hide();
			// the popovers cancel each other 
			// setTimeout to force synchronicity
			setTimeout(function() {
				self.emit('toggleroomcreation', self.trigger)
			});
		};
		self.events.bind('click button.new', 'toggleRoomCreation');
	}
	
	// this behaviour is exceptional in our popover logic:
	// a popover opens another popover with the same trigger,
	// so we have to proxy the trigger
	this.once('show', setRoomCreation);
	this.events.bind('click li.leave', 'leaveRoom');
};

RoomPopover.prototype.redraw = function RoomPopover_redraw() {
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/room.jade'));
	if (this.itemList) this.itemList.redraw();
};

RoomPopover.prototype.onMemberLeftChannel = function RoomPopover_onMemberLeftChannel (room) {
	this.itemList.redraw();
}

RoomPopover.prototype.onNewRoomMember = function RoomPopover_onNewRoomMember() {
	this.itemList.redraw();
}

RoomPopover.prototype.onNewRoom = function RoomPopover_onNewRoom() {
	this.itemList.redraw();
}

RoomPopover.prototype.onChannelUpdate = function RoomPopover_onChannelUpdate() {
	this.itemList.redraw();
}

RoomPopover.prototype.onRoomDeleted = function RoomPopover_onRoomDeleted() {
	this.itemList.redraw();
}

RoomPopover.prototype.onJoinedChannel = function RoomPopover_onJoinedChannel() {
	this.itemList.redraw();
}

RoomPopover.prototype.onLeftChannel = function RoomPopover_onLeftChannel (room) {
	if (!room.is_public) {
		var roomIndex = this.itemList.items.indexOf(room);
		this.itemList.items.splice(roomIndex, 1);
	}	
	this.itemList.redraw();
}

RoomPopover.prototype.setItems = function RoomPopover_setItems(items) {
	this.itemList.setItems(items);
};

RoomPopover.prototype.onOrgReady = function RoomPopover_onOrgReady(org) {
	this.setItems(org.rooms);
}