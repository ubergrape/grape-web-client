/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../rendervdom');
var Popover = require('./popover');
var classes = require('classes');

module.exports = RoomMembersPopover;

function RoomMembersPopover() {
	Popover.call(this);
}

RoomMembersPopover.prototype = Object.create(Popover.prototype);

RoomMembersPopover.prototype.init = function RoomMembersPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
};

RoomMembersPopover.prototype.redraw = function RoomMembersPopover_redraw() {
	render(this.content, template('roommemberspopover'));
}
