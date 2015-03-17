var Popover = require('./popover');

module.exports = RoomCreationPopover;

function RoomCreationPopover() {
	Popover.call(this);
}

RoomCreationPopover.prototype = Object.create(Popover.prototype);

RoomCreationPopover.prototype.init = function RoomCreationPopover_init() {
	Popover.prototype.init.call(this);
	console.log('roomcreation popover');
}