/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var qs = require('query');
var template = require('template');
var render = require('../rendervdom');

module.exports = SearchView;

function SearchView() {
	this.redraw.bind(this);
	this.init();
	this.search = {};
}


SearchView.prototype.init = function SearchView_init() {
	this.results = [];
	var self = this;
	document.addEventListener('keyup', function(ev) {
		if (!self.hidden)
			if (ev.keyCode === 27) self.hideResults();
	});
	document.addEventListener('click', function (ev) {
		if (!self.hidden) {
			var target = ev.target;
			var parent = target;
			do {
				if (parent === self.el || parent === self.trigger) return;
			} while ((parent = parent.parentNode));
			self.hideResults();
		}
	});
};

SearchView.prototype.redraw = function SearchView_redraw() {
	render(this.search, template('searchresults', {
		'results': this.results
	}));	
};


SearchView.prototype.showResults = function SearchView_showResults(results) {
	this.results = results;
	this.redraw();
	this.el = this.search.el;
	qs('div.chat-wrapper').appendChild(this.el);
	this.hidden = false;
};

SearchView.prototype.hideResults = function SearchView_removeResults() {
	this.results = [];
	this.redraw();
	this.el.parentNode.removeChild(this.el);
	this.hidden = true;
};

