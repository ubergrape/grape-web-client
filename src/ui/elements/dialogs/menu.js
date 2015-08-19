var template = require('template')
var render = require('../../rendervdom')

module.exports = Menu;

function Menu (options) {
	this.template = options.template;
	this.items = [];
	this.templateOptions = options.templateOptions ? options.templateOptions : null;
	this.selected = null;
}

Menu.prototype.redraw = function Menu_redraw() {
	render(this, template(this.template, this.extendTemplateOptions()));
}

Menu.prototype.extendTemplateOptions = function () {
	var options = {
		items: this.items,
		selected: this.selected
	};
	for (var item in this.templateOptions) {
		options[item] = this.templateOptions[item];
	}
	return options;
}

Menu.prototype.setTabs = function Menu_setItems(items, selected) {
	this.selected = items[0];
	this.items = items;
	this.redraw();
}

Menu.prototype.selectItem = function Menu_selectItem(item) {
	this.selected = item;
	this.redraw();
}