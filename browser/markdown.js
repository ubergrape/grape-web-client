/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var marked = require('marked');
var markdown_renderlink = require('./markdown_renderlink');

var renderer = new marked.Renderer();
renderer.link_simple = marked.Renderer.prototype.link;
renderer.link = function(href, title, text) {
	if (href.slice(0, 5) === "cg://") {
		return markdown_renderlink(href, title, text);
	} else {
		return this.link_simple(href, title, text);
	}
};
renderer.heading = function (text, level) {
	// this is a hack, we should replace the markdown parser
	return Array(level+1).join("#") + text;
};
renderer.hr = function() {
		return "--";
};


marked.setOptions({
	renderer: renderer,
	gfm: true,
	breaks: true
});


module.exports = marked;
