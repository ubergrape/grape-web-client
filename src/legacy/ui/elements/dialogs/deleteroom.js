import Dialog from './dialog'
import events from 'component-events'
import qs from 'component-query'

// Legacy translation tool requires a _ variable untouched by webpack.
const _ = require('t')

module.exports = DeleteRoomDialog

function DeleteRoomDialog(context) {
  this.template_path = 'dialogs/deleteroom.jade'
  Dialog.call(this, context)
  this.button = qs('.delete-room-button', this.el)
  this.form = qs('.delete-room-form', this.el)
  if (this.form) this.roomNameInput = this.form.roomname
}

DeleteRoomDialog.prototype = Object.create(Dialog.prototype)

DeleteRoomDialog.prototype.bind = function DeleteRoomDialog_bind() {
  this.events = events(this.el, this)
  this.events.obj.submit = this.submit.bind(this)
  this.events.obj.resetvalidity = this.resetvalidity.bind(this)
  this.events.bind('submit .delete-room-form', 'submit')
  this.events.bind('input .roomname', 'resetvalidity')
}

DeleteRoomDialog.prototype.submit = function DeleteRoomDialog_submit(ev) {
  ev.preventDefault()
  const self = this

  const roomName = self.roomNameInput.value.trim()
  if (!roomName) {
    self.roomNameInput.setCustomValidity(_('Please enter the name of the room you want to delete.'))
    self.button.click()
    return
  }

  self.emit('deleteroom', self.context.room, roomName, (err, result) => {
    if (err) {
      self.roomNameInput.setCustomValidity(err.message)
      self.button.click()
    } else {
      self.dialog.hide()
    }
  })
}

DeleteRoomDialog.prototype.resetvalidity = function DeleteRoomDialog_resetvalidity() {
  this.roomNameInput.setCustomValidity('')
}

