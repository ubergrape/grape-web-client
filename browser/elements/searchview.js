/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var qs = require('query');
var template = require('template');
var render = require('../rendervdom');
var Emitter = require('emitter');

module.exports = SearchView;

function SearchView() {
	Emitter.call(this);
	this.redraw.bind(this);
	this.init();
	this.search = {};
}

SearchView.prototype = Object.create(Emitter.prototype);

SearchView.prototype.init = function SearchView_init() {
	this.results = [];
	this.hidden = true;
	var self = this;
	document.addEventListener('keyup', function(ev) {
		if (!self.hidden)
			if (ev.keyCode === 27) self.hideResults();
	});
	document.addEventListener('click', function (ev) {
		if (!self.hidden) {
			var parent = ev.target;
			do {
				if (parent === self.el ||
					(parent.className === 'search' &&
					 parent.tagName === 'INPUT')) return;
			} while ((parent = parent.parentNode));
			self.hideResults();
		}
	});
};

SearchView.prototype.redraw = function SearchView_redraw() {
	render(this.search, template('searchresults.jade', {
		'results': this.results
	}));
};


SearchView.prototype.showResults = function SearchView_showResults(results) {
	this.results = results;
	this.redraw();
	this.el = this.search.el;
	qs('div.chat-wrapper').appendChild(this.el);
	this.hidden = false;
	this.emit('show');
};

SearchView.prototype.hideResults = function SearchView_removeResults() {
	if (!self.hidden) {
		this.results = [];
		this.el.parentNode.removeChild(this.el);
		this.hidden = true;
		this.emit('hide');
	}
};

