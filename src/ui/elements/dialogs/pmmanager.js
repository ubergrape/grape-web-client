let Dialog = require('./dialog')
let Menu = require('./menu')
let ItemList = require('../itemlist')
let qs = require('query')
let events = require('events')

module.exports = PMManager

function PMManager (context) {
  this.template_path = 'dialogs/pmmanager.jade'
  this.mode = 'active'
  Dialog.call(this, context)
}

PMManager.prototype = Object.create(Dialog.prototype)
let protoInit = PMManager.prototype.init

PMManager.prototype.init = function () {
  let menu = this.menu = new Menu({
    header: 'Manage Private Messages',
    tabs: {
      visible: true
    },
    button: null
  })

  menu.setTabs([
    {
      className: 'active-users',
      title: 'Active'
    },
    {
      className: 'invited-users',
      title: 'Invited'
    },
    {
      className: 'deleted-users',
      title: 'Deleted'
    }
  ])

  let pmList = this.pmList = new ItemList({
    template: 'dialogs/pmlist.jade',
    templateOptions: {
      mode: this.mode
    }
  })
  pmList.setItems(this.context.users.filter(function(user){
    return user != ui.user
  }))
  pmList.order('displayName')

  function replace(from, to) {
    from.parentNode.replaceChild(to, from)
  }
  protoInit.call(this)
  replace(qs('.manager-menu', this.dialog.el), menu.el)
  replace(qs('ul', this.dialog.el), pmList.el)
}

PMManager.prototype.bind = function () {
  this.events = events(this.el, this)
  this.events.bind('click .active-users', 'setActive')
  this.events.bind('click .invited-users', 'setInvited')
  this.events.bind('click .deleted-users', 'setDeleted')
}

PMManager.prototype.setActive = function () {
  this.mode = this.pmList.templateOptions.mode = 'active'
  this.redrawContent(0)
}

PMManager.prototype.setInvited = function () {
  this.mode = this.pmList.templateOptions.mode = 'invited'
  this.redrawContent(1)
}

PMManager.prototype.setDeleted = function () {
  this.mode = this.pmList.templateOptions.mode = 'deleted'
  this.redrawContent(2)
}

PMManager.prototype.redrawContent = function (selected) {
  let menu = this.menu
  menu.selectTab(null)
  menu.selectTab(menu.options.tabs.items[selected])
  this.pmList.order('displayName')
}

PMManager.prototype.onChangeUser = function () {
  this.pmList.redraw()
}

PMManager.prototype.onNewOrgMember = function (user) {
  this.pmList.items.push(user)
  this.pmList.redraw()
}

PMManager.prototype.end = function () {
  // hack to close the dialog
  qs('.close', this.el).click()
}