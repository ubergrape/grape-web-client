/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var marked = require('marked');
var markdown_renderlink = require('./markdown_renderlink');
var staticurl = require('../lib/staticurl.js');
var emoji = require('js-emoji');
emoji.img_path = staticurl('emoji/');
emoji.sheet_path = staticurl('app/sk7-js-emoji/images/sheet_32.png');
emoji.use_sheet = true;

var renderer = new marked.Renderer();


renderer.link_simple = function(href, title, text) {
	// Renderer.prototype.link, but with target blank
	var out = '<a target="_blank" href="' + href + '"';
	if (title) {
		out += ' title="' + title + '"';
	}
	out += '>' + text + '</a>';
	return out;
};
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
	breaks: true,
	emoji: function (emo) {
		emoji.init_colons();
		var val = emoji.map.colons[emo];
		return val ? emoji.replacement(val, emo, ':') : ':' + emo + ':';
	}
});

module.exports = marked;
