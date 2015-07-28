var Popover = require('./popover');
var template = require('template');
var render = require('../../rendervdom');
var classes = require('classes');
var qs = require('query');

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
	this.form = qs('form.create-room-form', this.el);
	this.newRoomName = this.form['newroom-name'];
	this.createButton = qs('input.create', this.form);
}

RoomCreationPopover.prototype.bind = function RoomCreationPopover_bind() {
	Popover.prototype.bind.call(this);

	this.events.obj.createRoom = function(e) {
		e.preventDefault();
		var room = {
			'name': this.newRoomName.value.trim(),
			'is_public': qs('input:checked', this.form).value
		};
		this.emit('createroom', room);
	}.bind(this);
	this.events.obj.resetValidity = function() {
		this.newRoomName.setCustomValidity('');
	}.bind(this);
	this.events.obj.toggleAddRoom = function () {
		this.emit('toggleaddroom', this.trigger) 
	}.bind(this);
	this.events.obj.cancel = function () {
		this.end();
	}.bind(this);

	this.events.bind('submit form.create-room-form', 'createRoom');
	this.events.bind('click input.back', 'cancel');
	this.events.bind('keydown input#newroom-name', 'resetValidity');

	this.on('show', function() {
		this.newRoomName.focus();
	});
	this.on('hide', function() {
		this.form.reset();
	});
}

RoomCreationPopover.prototype.redraw = function RoomCreationPopover_redraw() {
	this.classes.add('left');	
	render(this.content, template('popovers/roomcreation.jade'));
}

RoomCreationPopover.prototype.errorFeedback = function RoomCreationPopover_errorFeedback(err) {
	this.newRoomName.setCustomValidity(err.msg);
	this.createButton.click();
}

RoomCreationPopover.prototype.end = function RoomCreationPopover_end() {
	this.hide();
}

RoomCreationPopover.prototype.onTriggerRoomCreation = function RoomCreationPopover_onTriggerRoomCreation (target) {
	this.toggle(target);
}