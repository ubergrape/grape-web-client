/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var broker = require('broker');
var qs = require('query');
var template = require('template');
var classes = require('classes');

var ItemList = require('../itemlist');
var Popover = require('./popover');
var render = require('../../rendervdom');

module.exports = RoomPopover;

function RoomPopover() {
	Popover.call(this);
}

RoomPopover.prototype = Object.create(Popover.prototype);

RoomPopover.prototype.init = function RoomPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.itemList = new ItemList({template: 'popovers/roomlist', selector: '.toggle'});
	replace(qs('ul', this.el), this.itemList.el);
};

function replace(from, to) {
	from.parentNode.replaceChild(to, from);
}

RoomPopover.prototype.bind = function RoomPopover_bind() {
	Popover.prototype.bind.call(this);
	broker.pass(this.itemList, 'selectitem', this, 'selectitem');

	this.form = qs('.newroom', this.el);
	this.events.obj.openform = this.openform.bind(this);
	this.events.obj.closeform = this.closeform.bind(this);
	this.events.obj.submit = this.submit.bind(this);
	this.events.obj.resetvalidity = this.resetvalidity.bind(this);
	this.events.bind('click .new', 'openform');
	this.events.bind('reset .newroom', 'closeform');
	this.events.bind('submit .newroom', 'submit');
	this.events.bind('input #newroom-name', 'resetvalidity');
	this.on('hide', this.closeform.bind(this));
};

RoomPopover.prototype.submit = function RoomPopover_submit(ev) {
	ev.preventDefault();
	var room = {
		name: this.form['newroom-name'].value.trim(),
		private: qs('input:checked', this.form).value === 'private'
	};
	if (!room.name) return;
	this.emit('createroom', room);
};

RoomPopover.prototype.resetvalidity = function RoomPopover_resetvalidity() {
	this.form['newroom-name'].setCustomValidity('');
};

RoomPopover.prototype.validationError = function RoomPopover_validationError(err) {
	var details = err.details;
	if (details.name) {
		this.form['newroom-name'].setCustomValidity(details.name[0].message);
		this.form.submit.click();
	}
};

RoomPopover.prototype.openform = function RoomPopover_openform() {
	this.content.classes.add('openform');
	this.form['newroom-name'].focus();
};
RoomPopover.prototype.closeform = function RoomPopover_closeform() {
	this.content.classes.remove('openform');
	this.resetvalidity();
	this.form.reset();
};

RoomPopover.prototype.redraw = function RoomPopover_redraw() {
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/room'));
	if (this.itemList)
		this.itemList.redraw();
};

RoomPopover.prototype.setItems = function RoomPopover_setItems(items) {
	this.itemList.setItems(items);
};

