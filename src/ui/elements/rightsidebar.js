/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
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
	this.redraw(true);
	this.el = this.content.el;
	this.init();
	this.bind();
}

RightSidebar.prototype = Object.create(Emitter.prototype);

RightSidebar.prototype.init = function RightSidebar_init() {
	this.classes = classes(this.el);
	this.canKickMembers = false;
	this.visible = false;
	this.mode = null;
	this.redraw(true);
	this.userProfile = {};

	var membersList = this.membersList = new ItemList({
		template: 'roommembers.jade'
	});
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

RightSidebar.prototype.renderUserProfile = function (user) {
	console.log(user);
	render(this.userProfile, template('user-profile.jade', {
		user: user
	}));
}

RightSidebar.prototype.setListItems = function RightSidebar_setListItems(items) {
	this.membersList.setItems(items);
};

RightSidebar.prototype.select = function RightSidebar_select(item) {
	this.membersList.selectItem(null);
	this[item.type + 'List'].selectItem(item);
};

RightSidebar.prototype.redraw = function RightSidebar_redraw(force) {
	if (!this.visible && !force) return;

	var color = {r: 100, g: 50, b: 100};

	if (this.room.color)
		color = hexToRgb(this.room.color.toLowerCase());

	var vdom = template('rightsidebar.jade', {
		room: this.room,
		canKickMembers: this.canKickMembers,
		color: color,
		mode: this.mode
	});

	render(this.content, vdom);
};

/* scroll down in the members list */
RightSidebar.prototype.scrollDown = function RightSidebar_scrollDown() {
	var list = qs('.user-list', this.el);
	var scrollHeight = list.scrollHeight;
	list.scrollTop = scrollHeight;
};

RightSidebar.prototype.setRoom = function RoomMembers_setRoom(room) {
	this.mode = room.type;
	this.redraw(true);
	this.room = room;
	if (this.mode == 'room') {
		this.canKickMembers = (ui.user === room.creator || ui.user.role >= 1) ? true : false;
		this.setListItems({
			room: room,
			canKickMembers: this.canKickMembers
		});
		replace(qs('.right-sidebar-room-wrap', this.el), this.membersList.el);
	} else {
		this.renderUserProfile(room.users[0]);
		replace(qs('.right-sidebar-room-wrap', this.el), this.userProfile.el);
	}
	this.redraw(true);
};

RightSidebar.prototype.onMemberLeftChannel = function RightSidebar_onMemberLeftChannel(room) {
	if (room == this.room) this.members.redraw();
}

RightSidebar.prototype.onChangeUser = function (user) {
	this.membersList.redraw();
	this.renderUserProfile(user);
}

RightSidebar.prototype.toggle = function RightSidebar_toggle() {
	this.visible = !this.visible;
	var clientBody = qs('.client-body')
	clientBody.classList.toggle('right-sidebar-show')
}
