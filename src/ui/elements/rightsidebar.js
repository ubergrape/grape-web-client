/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var render = require('../rendervdom');
var ItemList = require('../utils/itemlist');
var qs = require('query');
var events = require('events');
var roles = require('conf').constants.roles;
var classes = require('classes');

module.exports = RightSidebar;

function RightSidebar () {
	Emitter.call(this);
	this.content = {};
	this.initialized = false;
	this.mode = null;
}

RightSidebar.prototype = Object.create(Emitter.prototype);

RightSidebar.prototype.init = function () {
	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	}

	var membersList = this.membersList = new ItemList({
		template: 'roommembers.jade',
		templateOptions: {
			canKickMembers: this.canKickMembers
		}
	});
	membersList.setItems(this.room.users.slice());
	this.redraw();
	qs('.right-sidebar').appendChild(this.content.el);

	// TODO: to implement the 3 views, 
	// set up all the template at init time
	// browsed files is also an itemlist with a menu - reuse those templates

	// when triggering the right sidebar
	// pass a parameter according to the trigger el
	// to change this.mode

	// this.mode can be 'files', 'members', 'search'

	// when redrawing, replace the same element  in the main template right-sidebar.jade
	// with one of the sub-templates (files, members, search)

	replace(qs('.members ul', this.content.el), membersList.el);
	this.bind();
};

RightSidebar.prototype.bind = function () {
	this.events = events(this.content.el, this);
	this.events.bind('click i.btn-delete', 'deleteRoomMember');
	this.events.bind('click .invite-members', 'toggleInvite');
};

RightSidebar.prototype.toggleInvite = function (ev) {
	this.emit('toggleInvite', this.room);
};

RightSidebar.prototype.deleteRoomMember = function (ev) {
	var roomID = this.room.id;
	var memberID = ev.target.getAttribute('data-id');
	this.emit('kickMember', roomID, memberID);
};

RightSidebar.prototype.redraw = function () {
	var memberCount = this.room.users.length.toString();
	render(this.content, template('rightsidebar.jade', {
		memberCount: memberCount
	}));
	this.membersList.order('displayName');
	this.membersList.redraw();
};

RightSidebar.prototype.setRoom = function (room) {
	this.room = room;
	this.canKickMembers = ui.user === room.creator || ui.user.role >= roles.ROLE_ADMIN ? true : false;
	
	if (room.type == 'pm') return this.emit('hideRightSidebar');
	
	if (!this.initialized) {
		this.init();
		this.initialized = true;
	} else {
		this.membersList.items = this.room.users.slice();
		this.membersList.templateOptions.canKickMembers = this.canKickMembers;
		this.redraw();
	}
};

RightSidebar.prototype.onMemberLeftChannel = function (room, user) {
	if (room != this.room) return;
	var userIndex = this.membersList.items.indexOf(user);
	if (userIndex > -1) this.membersList.items.splice(userIndex, 1);
	this.redraw();
};

RightSidebar.prototype.onChangeUser = function (user) {
	if (this.initialized && this.room.users.indexOf(user) > -1) this.membersList.redraw();
};

RightSidebar.prototype.onNewRoomMember = function (room, user) {
	if (room != this.room) return;
	this.membersList.items.push(user);
	this.redraw();
};

RightSidebar.prototype.toggle = function (mode) {
	var clientBody = qs('.client-body')
	if (mode == this.mode) {
		classes(clientBody).remove('right-sidebar-show')
		this.mode = null;
	} else {
		classes(clientBody).add('right-sidebar-show')
		this.mode = mode;
	}
}