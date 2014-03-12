/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');

module.exports = ChatHeader;

function ChatHeader() {
	Emitter.call(this);
	// initial room?
	this.room = new Emitter({name: '', users: []});
	this.redraw = this.redraw.bind(this);
	this.init();
}

ChatHeader.prototype = Object.create(Emitter.prototype);

ChatHeader.prototype.init = function ChatHeader_init() {
	this.el = document.createElement('div');
	this.el.className = 'chat-header';
	this.redraw();
};

ChatHeader.prototype.redraw = function ChatHeader_redraw() {
	// TODO: it should not clear/change the search field on redraw
	var self = this;
	this.el.innerHTML = template('chatheader', {
		room: this.room,
		search: '' // TODO: this.searchTerm,
	});
	qs('.searchform', this.el).addEventListener('submit', function (ev) {
		ev.preventDefault();
		self.emit('search', qs('.search', self.el).value);
	});
};

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
	qs('.search', this.el).value = '';
};

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room) {
	this.room.off('change', this.redraw);
	this.room = room;
	room.on('change', this.redraw);
	this.redraw();
};

