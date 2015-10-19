/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict"

var v = require('virtualdom')

module.exports = render

function render(obj, vdom) {
  if (!obj.vdom || !obj.el) {
    obj.vdom = vdom
    obj.el = v.toDOM(vdom)
    return
  }
  var diff = v.diff(obj.vdom, vdom)
  v.applyPatch(obj.el, diff)
  obj.vdom = vdom
}

