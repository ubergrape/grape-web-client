/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var closest = require('closest');
var events = require('events');
var render = require('../rendervdom');
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
	this.client = qs('.client', this.el); //dunno but seems to not work in .bind function
};

ChatHeader.prototype.bind = function ChatHeader_bind() {
	var self = this;
	this.events = events(this.el, {
		'toggleUserMenu': function (e) {self.emit('toggleusermenu', e.toElement)},
		'toggleMembersMenu': function (e) {
			self.membersMenu.toggle(e.toElement);
		}
	});
	this.events.bind('click .avatar-wrap', 'toggleUserMenu');
	this.events.bind('click .connected-users i', 'toggleMembersMenu');
	this.searchForm.addEventListener('submit', function (ev) {
		ev.preventDefault();
		self.emit('search', qs('.search', self.el).value);
	});
	this.searchInput.addEventListener('keyup', function (ev) {
		if ( this.value.length != 0 ) {
			classes(qs('.client', this.el)).add('searching');
		} else {
			classes(qs('.client', this.el)).remove('searching');
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

