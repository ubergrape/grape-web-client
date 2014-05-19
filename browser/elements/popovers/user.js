/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');

module.exports = UserPopover;

function UserPopover() {
	Popover.call(this);
}

UserPopover.prototype = Object.create(Popover.prototype);

UserPopover.prototype.init = function RoomPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
};

UserPopover.prototype.redraw = function UserPopover_redraw() {
	render(this.content, template('popovers/user'));
}
