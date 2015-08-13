/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var events = require('events');
var render = require('../rendervdom');

module.exports = ItemList;

function ItemList(options) {
	Emitter.call(this);
	this.template = options.template;
	this.templateOptions = options.templateOptions ? options.templateOptions : null;
	this.items = [];
	this.selected = null;
	this.redraw = this.redraw.bind(this);
	this.redraw();
}

ItemList.prototype = Object.create(Emitter.prototype);

ItemList.prototype.redraw = function () {
	var vdom = template(this.template, this.extendTemplateOptions());
	console.log(this.extendTemplateOptions());
	render(this, vdom);
};

ItemList.prototype.extendTemplateOptions = function () {
	var options = {
		items: this.items,
		selected: this.selected	
	};
	for (var item in this.templateOptions) {
		options[item] = this.templateOptions[item];
	}
	return options;
}

ItemList.prototype.setItems = function (items) {
	var self = this;
	this.selected = null;
	this.items = items;
	this.redraw();
};

ItemList.prototype.selectItem = function (item) {
	this.selected = item;
	this.redraw();
};

