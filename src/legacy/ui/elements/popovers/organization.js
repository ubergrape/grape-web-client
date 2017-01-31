import template from 'template'
import render from '../../rendervdom'
import Popover from './popover'
import classes from 'component-classes'
const constants = require('../../../../conf').constants

module.exports = OrganizationPopover

function OrganizationPopover() {
  Popover.call(this)
}

OrganizationPopover.prototype = Object.create(Popover.prototype)

OrganizationPopover.prototype.init = function () {
  Popover.prototype.init.call(this)
  this.content = {}
}

OrganizationPopover.prototype.bind = function () {
  Popover.prototype.bind.call(this)
  this.events.obj.editView = (e) => {
    e.preventDefault()
    this.emit('editView')
  }
  this.events.obj.toggleOrgInvite = () => this.emit('toggleOrgInvite')
  this.events.obj.onHide = ::this.hide
  this.events.bind('click a.edit-view', 'editView')
  this.events.bind('click .invite-new-members', 'toggleOrgInvite')
  this.events.bind('click a', 'onHide')
}

OrganizationPopover.prototype.redraw = function () {
  if (!this.org || !this.user) return
  this.classes.add('orga-po')
  this.classes.add('top')

  const vdom = template('popovers/organization.jade', {
    isInviter: this.user.role >= this.org.inviter_role,
    isOrgManager: this.user.role >= constants.roles.ROLE_ADMIN,
    isMacGap: typeof window.MacGap !== 'undefined'
  })

  render(this.content, vdom)
  this.content.classes = classes(this.content.el)
  this.el.appendChild(this.content.el)
}

OrganizationPopover.prototype.onOrgReady = function (org) {
  this.org = org
  this.redraw()
}

OrganizationPopover.prototype.onSetUser = function (user) {
  this.user = user
  this.redraw()
}

OrganizationPopover.prototype.onSettingsReady = function () {
  this.redraw()
}
