import Emitter from 'emitter';
import events from 'events';
import dialog from 'dialog';
import v from 'virtualdom';
import template from 'template';

module.exports = Dialog

function Dialog(context) {
  Emitter.call(this)
  this.context = context || {}
  this.init()
  this.bind()
  return this
}

Dialog.prototype = Object.create(Emitter.prototype)

Dialog.prototype.init = function Dialog_init() {
  let vdom = v.toDOM(template(this.template_path, this.context))
  this.dialog = dialog(vdom)
  this.el = this.dialog.el
}

Dialog.prototype.bind = function Dialog_bind() {
  this.events = events(this.el, this)
}

// proxy for dialog
Dialog.prototype.closable = function Dialog_closable() {
  this.dialog.closable()
  return this
}

// proxy for dialog
Dialog.prototype.show = function Dialog_show() {
  this.dialog.show()
  return this
}

// proxy for dialog
Dialog.prototype.overlay = function Dialog_overlay() {
  this.dialog.overlay()
  return this
}

