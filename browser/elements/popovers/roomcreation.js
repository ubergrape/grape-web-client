var Popover = require('./popover');
var template = require('template');
var render = require('../../rendervdom');
var classes = require('classes');

module.exports = RoomCreationPopover;

function RoomCreationPopover() {
	Popover.call(this);
}

RoomCreationPopover.prototype = Object.create(Popover.prototype);

RoomCreationPopover.prototype.init = function RoomCreationPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
}

RoomCreationPopover.prototype.redraw = function RoomCreationPopover_redraw() {
	this.classes.add('right');	
	render(this.content, template('popovers/roomcreation.jade'));
	this.el.focus();
}