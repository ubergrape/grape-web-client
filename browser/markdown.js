/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var marked = require('marked');
var renderautocomplete = require('./renderautocomplete');

var renderer = new marked.Renderer();
renderer.link_simple = marked.Renderer.prototype.link;
renderer.link = function(href, title, text) {
  if (href.slice(0, 5) == "cg://") {
    var data = href.slice(5).split('|');
    var object = {
      id: "[" + text + '](' + href + ')',
      insert: text,
      service: data[0],
      type: data[1]
    }
    return renderautocomplete(object);
  } else {
    return this.link_simple(href, title, text)
  }
};

marked.setOptions({
  renderer: renderer
});

module.exports = markdown;

function markdown(src, opt, callback) {
  return marked(src, opt, callback);
}
