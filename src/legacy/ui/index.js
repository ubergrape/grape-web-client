const Emitter = require('component-emitter')
const broker = require('broker')
const qs = require('component-query')
const classes = require('component-classes')
const events = require('component-events')

import staticUrl from '../../utils/static-url'
import timezone from './jstz'
import pipeEvents from './pipeEvents'


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

UI.prototype.gotError = function UI_gotError(err) {
  this.reduxEmitter.showToastNotification(err.message)
}

UI.prototype.setRoomContext = function UI_setRoomContext(room) {
  this.room = room
}

UI.prototype.onTriggerRoomManager = function UI_onTriggerRoomManager() {
  const roommanager = new RoomManager({
    rooms: this.org.rooms.slice()
  }).isClosable().overlay().show()
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
