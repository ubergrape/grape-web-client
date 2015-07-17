/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var marked = require('marked');
var markdown_renderlink = require('./markdown_renderlink');
var emoji = require('./emoji');

var renderer = new marked.Renderer();

renderer.link_simple = function(href, title, text) {
	// Renderer.prototype.link, but with target blank
	var out = '<a target="_blank" href="' + href + '"';
	if (title)
		out += ' title="' + title + '"';
	out += '>' + text + '</a>';
	return out;
};
renderer.link = function(href, title, text) {
	if (this.options.sanitize) {
	    try {
	      var prot = decodeURIComponent(unescape(href))
	        .replace(/[^\w:]/g, '')
	        .toLowerCase();
	    } catch (e) {
	      href = '';
	    }
		if (!href.match(/((mailto\:|cg\:|(news|(ht|f)tp(s?))\:\/){1}\S+)/)) href = '';
	}
	if (href.slice(0, 5) === "cg://")
		return markdown_renderlink(href, title, text);
	else
		return this.link_simple(href, title, text);
};
renderer.heading = function (text, level) {
	// this is a hack, we should replace the markdown parser
	return (new Array(level+1)).join("#") + text;
};
renderer.hr = function() {
	return "--";
};
renderer.image = function (href, title, text) {
  var out = '<span class="markdown-img-wrapper">';
  out += '<img src="' + href + '" alt="' + text + '"';
  if (title) out += ' title="' + title + '"';
  out += this.options.xhtml ? '/>' : '>';
  out += '</span>';
  return out;
};

marked.setOptions({
	renderer: renderer,
	sanitize: true,
	gfm: true,
	breaks: true,
	emoji: function (emo) {
		emoji.init_colons();
		// TODO: app.organization
		var custom_emojis = app.organization.custom_emojis;
		if (custom_emojis.hasOwnProperty(emo)) {
			return '<img src="'+custom_emojis[emo]+'" class="emoji" alt="'+emo+'"/>';
		}
		var val = emoji.map.colons[emo];
		return val ? emoji.replacement(val, emo, ':') : ':' + emo + ':';
	}
});

module.exports = marked;
