/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../../rendervdom');
var Popover = require('./popover');
var classes = require('classes');

module.exports = OrganizationPopover;

function OrganizationPopover() {
	Popover.call(this);
}

OrganizationPopover.prototype = Object.create(Popover.prototype);

OrganizationPopover.prototype.init = function OrganizationPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
};

OrganizationPopover.prototype.redraw = function OrganizationPopover_redraw() {
	render(this.content, template('popovers/organization'));
}
