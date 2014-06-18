/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var events = require('events');
var render = require('../rendervdom');
var debounce = require('debounce');
var classes = require('classes');
var RoomMembersPopover = require('./popovers/roommembers');

module.exports = ChatHeader;

function ChatHeader() {
	Emitter.call(this);
	// initial room?
	this.membersMenu = new RoomMembersPopover();
	this.room = new Emitter({name: '', users: []});
	this.redraw = this.redraw.bind(this);
	this.redraw();
	this.init();
	this.bind();
}

ChatHeader.prototype = Object.create(Emitter.prototype);

ChatHeader.prototype.init = function ChatHeader_init() {
	this.classes = classes(this.el);
	this.searchForm = qs('.search-form', this.el);
	this.searchInput = qs('.search', this.el);
	this.q = null;
};

ChatHeader.prototype.bind = function ChatHeader_bind() {
	var self = this;
	this.events = events(this.el, {
		'toggleUserMenu': function () {
			self.emit('toggleusermenu', qs('.user-menu-wrap', self.el));
		},
		'toggleMembersMenu': function (e) {
			self.membersMenu.toggle(e.toElement);
		}
	});
	this.events.bind('click .user-menu-wrap', 'toggleUserMenu');
	this.events.bind('click .connected-users', 'toggleMembersMenu');
	this.searchForm.addEventListener('submit', function (ev) {
		ev.preventDefault();
	});
	var startSearching = debounce(function () {
		self.emit('searching', self.q);
	}, 200, false);
	this.searchInput.addEventListener('keyup', function () {
		var q = (qs('input.search', self.el).value || this.value).replace(/^\s+|\s+$/g, '');
		if (this.value.length !== 0 && self.q !== q) {
			self.q = q;
			startSearching();
		}
	});
};

ChatHeader.prototype.redraw = function ChatHeader_redraw() {
	var vdom = template('chatheader', {room: this.room});
	render(this, vdom);
	this.membersMenu.redraw();
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	qs('.search', this.el).value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room) {
	this.room.off('change', this.redraw);
	this.room = room;
	this.membersMenu.room = room;
	room.on('change', this.redraw);
	this.redraw();
};

