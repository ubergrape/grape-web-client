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
};

SearchView.prototype.removeResults = function SearchView_removeResults() {
	this.results = [];
	this.redraw();
	qs('div.chat-wrapper').removeChild(this.el);
};

