var Dialog = require('./dialog');
var Menu = require('./menu');
var ItemList = require('../itemlist');
var qs = require('query');
var events = require('events');

module.exports = PMManager;

function PMManager (context) {
	this.template_path = 'dialogs/pmmanager.jade';
	this.mode = 'active';
	Dialog.call(this, context);
}

PMManager.prototype = Object.create(Dialog.prototype);
var protoInit = PMManager.prototype.init;

PMManager.prototype.init = function () {
	var menu = this.menu = new Menu({
		template: 'dialogs/menu.jade',
		templateOptions: {
			header: 'Manage Private Messages'
		}
	});
	menu.setItems([
		{
			className: 'active-users',
			title: 'Active'
		},
		{
			className: 'invited-users',
			title: 'Invited'
		},
		{
			className: 'deleted-users',
			title: 'Deleted'
		}
	]);

	var pmList = this.pmList = new ItemList({
		template: 'dialogs/pmlist.jade',
		templateOptions: {
			mode: this.mode
		}
	});
	pmList.setItems(this.context.users.filter(function(user){
		return user != ui.user
	}));

	function replace(from, to) {
		from.parentNode.replaceChild(to, from);
	}
	protoInit.call(this);
	replace(qs('.manager-menu', this.dialog.el), menu.el);
	replace(qs('ul', this.dialog.el), pmList.el);
}

PMManager.prototype.bind = function () {
	this.events = events(this.el, this);
	this.events.bind('click .active-users', 'setActive');
	this.events.bind('click .invited-users', 'setInvited');
	this.events.bind('click .deleted-users', 'setDeleted');	
}

PMManager.prototype.setActive = function () {
	this.mode = this.pmList.templateOptions.mode = 'active';
	this.redrawContent(0);
}

PMManager.prototype.setInvited = function () {
	this.mode = this.pmList.templateOptions.mode = 'invited';
	this.redrawContent(1);
}

PMManager.prototype.setDeleted = function () {
	this.mode = this.pmList.templateOptions.mode = 'deleted';
	this.redrawContent(2);
}

PMManager.prototype.redrawContent = function (selected) {
	var menu = this.menu;
	menu.selectItem(null);
	menu.selectItem(menu.items[selected]);
	this.pmList.redraw();
}

PMManager.prototype.end = function () {
	// hack to close the dialog
	qs('.close', this.el).click();
}