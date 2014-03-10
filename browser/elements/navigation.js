/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var Scrollbars = require('scrollbars');

var ItemList = require('./itemlist');

module.exports = Navigation;

function Navigation() {
	Emitter.call(this);
	this.init();
	this.bind();
}

Navigation.prototype = Object.create(Emitter.prototype);

Navigation.prototype.init = function Navigation_init() {
	var el = document.createElement('nav');
	el.className = 'navigation';
	document.createElement('div').appendChild(el);
	// XXX: this is a bit weird :-(
	var scr = new Scrollbars(el);
	this.el = scr.wrapper;

	// initialize the sub lists
	var roomList = this.roomList = new ItemList({template: 'roomlist'});
	el.appendChild(roomList.el);
	var pmList = this.pmList = new ItemList({template: 'pmlist', selector: '.item .name, .item .avatar, .item .unread'});
	el.appendChild(pmList.el);
	var labelList = this.labelList = new ItemList({template: 'labellist', selector: '.item .label'});
	el.appendChild(labelList.el);
};

// route the events
Navigation.prototype.bind = function Navigation_bind() {
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		self[which + 'List'].on('selectitem', function (item) {
			self.emit('select' + which, item);
		});
		self[which + 'List'].on('additem', function (item) {
			self.emit('add' + which, item);
		});
	});
};

Navigation.prototype.setLists = function Navigation_setLists(lists) {
	var self = this;
	['room', 'pm', 'label'].forEach(function (which) {
		if (lists[which + 's'])
			self[which + 'List'].setItems(lists[which + 's']);
	});
};

