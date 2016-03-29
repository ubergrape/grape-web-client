import Dialog from './dialog'
import events from 'events'
import qs from 'query'
import _ from 't'

export default OrgInvite

function OrgInvite(context) {
  this.template_path = 'dialogs/orginvite.jade'
  Dialog.call(this, context)
}

OrgInvite.prototype = Object.create(Dialog.prototype)

OrgInvite.prototype.bind = function () {
  this.events = events(this.el, this)
  this.events.bind('input .input-invite', 'resetValidity')
  this.events.bind('submit .invite-to-org', 'inviteToOrg')
}

OrgInvite.prototype.inviteToOrg = function (e) {
  e.preventDefault()
  let inviteInput = qs('.input-invite', this.el)
  let inviteButton = qs('.btn-invite', this.el)
  this.resetValidity()
  if (inviteInput.value === '') {
    inviteInput.setCustomValidity(_('Please enter at least one user to invite'))
    setTimeout(function () { inviteButton.click() })
    return
  }
  inviteButton.disabled = true
  this.emit('inviteToOrg', inviteInput.value)
}

OrgInvite.prototype.onInviteError = function () {
  let inviteInput = qs('.input-invite', this.el)
  let inviteButton = qs('.btn-invite', this.el)
  inviteInput.setCustomValidity(_('Enter valid email addresses separated by a space.'))
  inviteButton.disabled = false
  setTimeout(function () { inviteButton.click() })
}

OrgInvite.prototype.onInviteSuccess = function () {
  this.dialog.hide()
}

OrgInvite.prototype.resetValidity = function () {
  let inviteInput = qs('.input-invite', this.el)
  inviteInput.setCustomValidity('')
}
