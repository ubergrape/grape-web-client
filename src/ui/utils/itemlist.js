/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Emitter = require('emitter');
var template = require('template');
var render = require('../rendervdom');
var defaults = require('lodash/object/defaults');

module.exports = ItemList;

function ItemList(options) {
    Emitter.call(this);
    this.template = options.template;
    this.templateOptions = options.templateOptions ? options.templateOptions : null;
    this.items = [];
    this.highlighted = [];
    this.selected = null;
    this.redraw = this.redraw.bind(this);
    this.redraw();
}

ItemList.prototype = Object.create(Emitter.prototype);

ItemList.prototype.redraw = function() {
    var vdom = template(this.template, this.getTemplateOptions());
    render(this, vdom);
};

ItemList.prototype.getTemplateOptions = function() {
    var options = {
        items: this.items,
        selected: this.selected,
        highlighted: this.highlighted
    };
    defaults(options, this.templateOptions);
    return options;
}

ItemList.prototype.setItems = function(items) {
    var self = this;
    this.selected = null;
    this.items = items;
    this.redraw();
};

ItemList.prototype.selectItem = function(item) {
    this.selected = item;
    this.redraw();
};

ItemList.prototype.toggleItem = function(item) {
    var itemIndex = this.highlighted.indexOf(item);
    if (itemIndex == -1) this.highlighted.push(item);
    else this.highlighted.splice(itemIndex, 1);
    this.redraw();
}

ItemList.prototype.order = function(whatBy) {
    this.items.sort(function(a, b) {
        return a[whatBy].localeCompare(b[whatBy]);
    });
    this.redraw();
}
