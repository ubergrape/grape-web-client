/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var events = require('events');

module.exports = Popover;

function Popover() {
	this.init();
	this.bind();
}

Popover.prototype.init = function Popover_init() {
	this.el = document.createElement('div');
	this.el.className = 'popover hide';
	this.hidden = true;
};

Popover.prototype.bind = function Popover_bind() {
	var self = this;
	this.events = events(this.el, {
		close: function () {
			self.hide();
		}
	});
	this.events.bind('click .close', 'close');
	document.addEventListener('click', function (ev) {
		if (self.hidden) return;
		var target = ev.target;
		var parent = target;
		do {
			if (parent === self.el || parent === self.trigger) return;
		} while ((parent = parent.parentNode));
		self.hide();
	});
};

Popover.prototype.show = function Popover_show(trigger) {
	this.trigger = trigger;
	this.el.className = 'popover';
	var offset = trigger.getBoundingClientRect();
	this.el.style.top = offset.top + 'px';
	this.el.style.left = offset.left + offset.width + 'px';
	document.body.appendChild(this.el);
	this.hidden = false;
};

Popover.prototype.hide = function Popover_hide() {
	this.el.className = 'popover hide';
	this.el.parentNode.removeChild(this.el);
	this.hidden = true;
};

