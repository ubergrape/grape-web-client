var template = require('template')
var render = require('../../rendervdom')

module.exports = Menu;

function Menu (options) {
	this.template = options.template;
	this.items = [];
	this.selected = null;
	//this.redraw();
}

Menu.prototype.redraw = function Menu_redraw() {
	var options = {
		items: this.items,
		selected: this.selected
	};
	render(this, template(this.template, options));
}

Menu.prototype.setItems = function Menu_setItems(items, selected) {
	this.selected = items[0];
	this.items = items;
	this.redraw();
}

Menu.prototype.selectItem = function Menu_selectItem(item) {
	this.selected = item;
	this.redraw();
}