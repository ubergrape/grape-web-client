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
}

RoomCreationPopover.prototype.bind = function RoomCreationPopover_bind() {
	Popover.prototype.bind.call(this);

	this.events.obj.createRoom = function(e) {
		e.preventDefault();
		var room = {
			'name': this.form['newroom-name'].value.trim(),
			'is_public': qs('input:checked', this.form).value
		};
		this.emit('createroom', room);
	}.bind(this);
	
	this.events.bind('submit form.create-room-form', 'createRoom');
	this.on('show', function() {
		this.form['newroom-name'].focus();
	});
	this.on('hide', function() {
		this.form.reset();
	})
}

RoomCreationPopover.prototype.redraw = function RoomCreationPopover_redraw() {
	this.classes.add('right');	
	render(this.content, template('popovers/roomcreation.jade'));
}