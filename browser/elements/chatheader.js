/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var qs = require('query');
var render = require('../rendervdom');

module.exports = ChatHeader;

function ChatHeader() {
	Emitter.call(this);
	// initial room?
	this.room = new Emitter({name: '', users: []});
	this.redraw = this.redraw.bind(this);
	this.redraw();
	this.bind();
}

ChatHeader.prototype = Object.create(Emitter.prototype);

ChatHeader.prototype.bind = function ChatHeader_bind() {
	var self = this;
	qs('.search-form', this.el).addEventListener('submit', function (ev) {
		ev.preventDefault();
		self.emit('search', qs('.search', self.el).value);
	});
};

ChatHeader.prototype.redraw = function ChatHeader_redraw() {
	var vdom = template('chatheader', {room: this.room});
	render(this, vdom);
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

