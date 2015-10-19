var Dialog = require('./dialog')

module.exports = MarkdownTipsDialog

function MarkdownTipsDialog() {
  this.template_path = 'dialogs/markdowntips.jade'
  Dialog.call(this)
}

MarkdownTipsDialog.prototype = Object.create(Dialog.prototype)
