var qs = require('query');
var template = require('template');
var classes = require('classes');
var ItemList = require('../itemlist');
var Popover = require('./popover');
var render = require('../../rendervdom');
var closest = require('closest');


module.exports = PMManagerPopover;

function PMManagerPopover() {
	Popover.call(this);
};

PMManagerPopover.prototype = Object.create(Popover.prototype);

PMManagerPopover.prototype.init = function PMManagerPopover_init() {
	Popover.prototype.init.call(this);
	this.content = {};
	this.tabSelection = 'active';
	this.redraw();
	this.content.classes = classes(this.content.el);
	this.el.appendChild(this.content.el);
	this.PMList = new ItemList({
		template: 'popovers/pmlist.jade',
		selector: '.toggle',
		templateOptions: {
			tabSelection: this.tabSelection
		}
	});
	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	};
	replace(qs('ul', this.el), this.PMList.el);
};

PMManagerPopover.prototype.bind = function PMManagerPopover_bind() {
	Popover.prototype.bind.call(this);
	var self = this;

	this.events.obj.setActive = function(e) {
		self.tabSelection = 'active';
		self.PMList.templateOptions.tabSelection = self.tabSelection;
		self.redraw();
	};
	this.events.obj.setInvited = function(e) {
		self.tabSelection = 'invited';
		self.PMList.templateOptions.tabSelection = self.tabSelection;
		self.redraw();
	};
	this.events.obj.setDeleted = function(e) {
		self.tabSelection = 'deleted';
		self.PMList.templateOptions.tabSelection = self.tabSelection;
		self.redraw();
	};
	this.events.bind('click a.active-users', 'setActive');
	this.events.bind('click a.invited-users', 'setInvited');
	this.events.bind('click a.deleted-users', 'setDeleted');
}

PMManagerPopover.prototype.redraw = function PMManagerPopover_redraw() {
	this.classes.add('room-po');
	this.classes.add('left');
	render(this.content, template('popovers/pmmanager.jade', {
		tabSelection: this.tabSelection
	}));
	if (this.PMList) this.PMList.redraw();
};

PMManagerPopover.prototype.onTriggerPMManager = function PMManagerPopover_onTriggerPMManager (target) {
	this.toggle(target);
};

PMManagerPopover.prototype.onSelectChannel = function PMManagerPopover_onSelectChannel (channel) {
	if (channel.type === 'room') return;
	var pmIndex = this.PMList.items.indexOf(channel.users[0]);
	if (pmIndex > -1) this.PMList.items.splice(pmIndex, 1);
	this.redraw();
};

PMManagerPopover.prototype.onOrgReady = function PMManagerPopover_onOrgReady (org) {
	var pms = org.users.filter(function(user) {
		return ui.user != user && (!user.active || !user.pm || (user.pm && !user.pm.latest_message_time));

	});
	this.PMList.setItems(pms);
};