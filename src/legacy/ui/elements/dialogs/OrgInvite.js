import Dialog from './dialog'
import events from 'events'
import qs from 'query'
import _ from 't'

export default OrgInvite

const isElectron = window.process && process.versions && process.versions.electron

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
    const text = _('Please enter at least one user to invite')
    if (isElectron) this.setElectronErrorText(text)
    inviteInput.setCustomValidity(text)
    setTimeout(function () { inviteButton.click() })
    return
  }
  inviteButton.disabled = true
  this.emit('inviteToOrg', inviteInput.value)
}

OrgInvite.prototype.onInviteError = function () {
  let inviteInput = qs('.input-invite', this.el)
  let inviteButton = qs('.btn-invite', this.el)
  const text = _('Enter valid email addresses separated by a space.')
  if (isElectron) this.setElectronErrorText(text)
  inviteInput.setCustomValidity(text)
  inviteButton.disabled = false
  setTimeout(function () { inviteButton.click() })
}

OrgInvite.prototype.onInviteSuccess = function () {
  this.dialog.hide()
}

OrgInvite.prototype.resetValidity = function () {
  let inviteInput = qs('.input-invite', this.el)
  if (isElectron) this.setElectronErrorText('')
  inviteInput.setCustomValidity('')
}

OrgInvite.prototype.setElectronErrorText = function (text) {
  if (!this.electronErrEl) this.electronErrEl = qs('.electron-error', this.el)
  this.electronErrEl.textContent = text
}
