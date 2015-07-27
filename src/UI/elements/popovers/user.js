/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');
var query = require('query');

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
	this.classes.add('user-po');
	this.classes.add('top');
	render(this.content, template('popovers/user.jade'));
};

UserPopover.prototype.show = function RoomPopover_show() {
	Popover.prototype.show.apply(this, arguments);
	// intercom button
  query('a#Intercom', this.content.el).addEventListener("click", function(e) {
		// manually attaching the intercom-show handler here
		// because due to our indirect use of intercom (via 
		// segment's analytics.js), we cannot set the 
		// intercom settings activator id
		e.preventDefault();
		window.Intercom("show");  
	});
};

