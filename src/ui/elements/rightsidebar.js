/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var Scrollbars = require('scrollbars');
var render = require('../rendervdom');
var ItemList = require('./itemlist');
var qs = require('query');
var events = require('events');
var classes = require('classes');
var broker = require('broker');
var hexToRgb = require('color-converter')

module.exports = RightSidebar;

function RightSidebar() {
	Emitter.call(this);
	this.content = {};
	this.room = new Emitter({name: '', users: []});
	this.redraw();
	this.el = this.content.el;
	this.init();
	this.bind();
}

RightSidebar.prototype = Object.create(Emitter.prototype);

RightSidebar.prototype.init = function RightSidebar_init() {
	this.classes = classes(this.el);
	this.canKickMembers = false;
	this.redraw();

	var uploadsList = this.uploadsList = new ItemList({
		template: 'uploads.jade'
	});
//	replace(qs('.uploads', this.el), uploadsList.el);

	var membersList = this.membersList = new ItemList({
		template: 'roommembers.jade',
		selector: '.item a'
	});
	replace(qs('.members', this.el), membersList.el);

	var	navScrollbar = new Scrollbars(qs('.right-sidebar-room-wrap', this.el));
};

RightSidebar.prototype.bind = function RightSidebar_bind() {
	var self = this;
	this.events = events(this.el, {
		close: function () {
			self.hide();
		}
	});
	this.events.obj.toggleInvite = function(ev) {
		this.emit('toggleInvite', this.room);
	}.bind(this);
	this.events.obj.deleteRoomMember = function (ev) {
		var roomID = this.room.id;
		var memberID = ev.target.getAttribute('data-id');
		this.emit('kickMember', roomID, memberID);
	}.bind(this);
	this.events.bind('click i.btn-delete', 'deleteRoomMember');
	this.events.bind('click .invite-members', 'toggleInvite');
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

RightSidebar.prototype.setListItems = function RightSidebar_setListItems(items) {
	this.uploadsList.setItems(items);
	this.membersList.setItems(items);
};

RightSidebar.prototype.select = function RightSidebar_select(item) {
	this.uploadsList.selectItem(null);
	this.membersList.selectItem(null);
	this[item.type + 'List'].selectItem(item);
};

RightSidebar.prototype.redraw = function RightSidebar_redraw() {
	var color = {r: 100, g: 50, b: 100};

	if (this.room.color)
		color = hexToRgb(this.room.color.toLowerCase());

	var vdom = template('rightsidebar.jade', {
		room: this.room,
		canKickMembers: this.canKickMembers,
		color: color
	});

	render(this.content, vdom);

//	if (this.uploadsList) this.uploadsList.redraw();
	if (this.membersList) this.membersList.redraw();
};

/* scroll down in the members list */
RightSidebar.prototype.scrollDown = function RightSidebar_scrollDown() {
	var list = qs('.user-list', this.el);
	var scrollHeight = list.scrollHeight;
	list.scrollTop = scrollHeight;
};

RightSidebar.prototype.setRoom = function RoomMembers_setRoom(room) {
	var self = this;
	var redraw_wrapped = function(ev) {
		self.redraw();
	};
	var user_added = function(ev) {
		self.redraw();
		self.scrollDown();
	};
	this.room = room;
	room.users.off('add', user_added);
	room.off('change', redraw_wrapped);
	room.users.on('add', user_added);
	room.on('change', redraw_wrapped);
	this.canKickMembers = (ui.user === room.creator || ui.user.role >= 1) ? true : false;

	this.setListItems({room: this.room, canKickMembers: this.canKickMembers});
	this.redraw();
	if (room.type == 'pm') classes(qs('.client-body')).remove('right-sidebar-show');
};

RightSidebar.prototype.onMemberLeftChannel = function RightSidebar_onMemberLeftChannel(room) {
	if (room == this.room) this.members.redraw();
}

RightSidebar.prototype.toggle = function RightSidebar_toggle() {
	var clientBody = qs('.client-body')
	clientBody.classList.toggle("right-sidebar-show")
}
