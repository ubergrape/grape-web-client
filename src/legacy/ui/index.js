const Emitter = require('component-emitter')
const broker = require('broker')
const qs = require('component-query')
const classes = require('component-classes')
const events = require('component-events')

import staticUrl from '../../utils/static-url'
import timezone from './jstz'
import pipeEvents from './pipeEvents'
import page from 'page'
import setUpRouter from '../init-router'


// Legacy translation tool requires a _ variable untouched by webpack.
const _ = require('t-component')

const exports = module.exports = UI

import reduxEmitter from '../redux-emitter'
import * as alerts from '../../constants/alerts'

function UI(options) {
  Emitter.call(this)
  this.options = options || {}
  this.init()
  this.bind()
}

UI.prototype = Object.create(Emitter.prototype)

UI.prototype.init = function UI_init() {
  // set the current language
  _[this.options.languageCode] = this.options.messages
  _.lang(this.options.languageCode || 'en')
  this.reduxEmitter = reduxEmitter

  const self = this

  // check timezone
  this.tz = timezone.determine().name()
  this.firstTimeConnect = true
}

UI.prototype.bind = function UI_bind() {
  pipeEvents(this)
  this.room = null
}

UI.prototype.requestPermission = function() {
  notify.requestPermission()
}

UI.prototype.setOrganization = function UI_setOrganization(org) {
  this.org = org
  this.emit('orgReady', this.org)
  setUpRouter(this)
}

UI.prototype.setUser = function UI_setUser(user) {
  // the first time setUser will be called it hopefully contains the current
  // user and not another one
  if (this.user === undefined || user.id === this.user.id) {
    this.user = user
    this.emit('setUser', user)
  }
}

UI.prototype.setSettings = function UI_setSettings(settings) {
  this.settings = settings

  this.emit('settingsReady')

  // javscript timezone should always override server timezone setting?
  if (!this.settings.timezone || this.settings.timezone !== this.tz) {
    this.emit('timezonechange', this.tz)
  }
}

UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
  const self = this
  const org = orgs.filter((o) => {
    if (o.id === self.options.organizationId) return o
  })[0]
  this.emit('selectorganization', org)
}

UI.prototype.gotError = function UI_gotError(err) {
  this.reduxEmitter.showToastNotification(err.message)
}

UI.prototype.setRoomContext = function UI_setRoomContext(room) {
  this.room = room
}

UI.prototype.leftChannel = function UI_leftChannel(room) {
  if (this.room !== room) return
  page.replace('/chat/')
}

UI.prototype.channelUpdate = function UI_channelUpdate(room) {
  if (this.room !== room) return
  page.replace(`/chat/${room.slug}`)
}

UI.prototype.onMessageNotFound = function UI_onMessageNotFound(channel) {
  // TODO: need to be fixed before PR accepted!
  const redirectSlug = channel.type === 'pm' ? channel.users[0].slug : channel.slug

  page.redirect(`/chat/${redirectSlug}`)
  this.reduxEmitter.showAlert({
    level: 'warning',
    type: alerts.MESSAGE_NOT_FOUND,
    closeAfter: 6000
  })
}

UI.prototype.onInvalidUrl = function(cause) {
  page.redirect('/chat/')
  this.reduxEmitter.showAlert({
    level: 'warning',
    type: cause,
    closeAfter: 6000
  })
}

UI.prototype.onTriggerRoomManager = function UI_onTriggerRoomManager() {
  const roommanager = new RoomManager({
    rooms: this.org.rooms.slice()
  }).closable().overlay().show()
  broker.pass(roommanager, 'leaveRoom', this, 'leaveRoom')
  broker(this, 'leftChannel', roommanager, 'onLeftChannel')
  broker(this, 'joinedChannel', roommanager, 'onJoinedChannel')
  broker(this, 'newRoom', roommanager, 'onNewRoom')
  broker(this, 'channelupdate', roommanager, 'onChannelUpdate')
}

UI.prototype.onShowSidebar = function() {
  classes(this.clientBody).add('right-sidebar-show')
}

UI.prototype.onHideSidebar = function() {
  classes(this.clientBody).remove('right-sidebar-show')
}
