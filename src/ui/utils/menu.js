let template = require('template')
let render = require('../rendervdom')

module.exports = Menu

function Menu (options) {
  this.template = 'dialogs/menu.jade'
  this.options = options
}

Menu.prototype.redraw = function () {
  render(this, template(this.template, this.options))
}

Menu.prototype.setTabs = function (tabs, selected) {
  this.options.tabs.selected = tabs[0]
  this.options.tabs.items = tabs
  this.redraw()
}

Menu.prototype.selectTab = function (tab) {
  this.options.tabs.selected = tab
  this.redraw()
}
