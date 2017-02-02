const Emitter = require('component-emitter')
const broker = require('broker')
const qs = require('component-query')
const classes = require('component-classes')
const events = require('component-events')
const notify = require('html5-desktop-notifications')
const Introjs = require('intro.js').introJs

import staticUrl from '../../utils/static-url'
import timezone from './jstz'
import focus from './focus'
import pipeEvents from './pipeEvents'
import page from 'page'
import setUpRouter from '../init-router'
import template from 'template'
import v from 'virtualdom'

import GrapeInput from './elements/GrapeInput'
import Notifications from './elements/notifications'
import DeleteRoomDialog from './elements/dialogs/deleteroom'


require('startswith')
require('endswith')

// Legacy translation tool requires a _ variable untouched by webpack.
const _ = require('t')

const exports = module.exports = UI

exports.GrapeInput = GrapeInput
exports.Notifications = Notifications
exports.DeleteRoomDialog = DeleteRoomDialog

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
  template.locals._ = _
  template.locals.staticUrl = staticUrl
  // initialize user and org with dummy image
  template.locals.user = {
    avatar: staticUrl('images/orga-image-load.gif'),
    username: 'Loading',
    displayName: 'Loading'
  }
  template.locals.org = {
    logo: staticUrl('images/orga-image-load.gif'),
    name: 'Loading'
  }

  // initialize the input field
  this.grapeInput = new GrapeInput()

  this.reduxEmitter = reduxEmitter

  const self = this
  // initialize notifications
  this.notifications = new Notifications()
  // only show notification info bar in supported browsers and only if the
  // user has't accepted or declined notifications before
  // don't show it in IE. it only supports notifications in "SiteMode" and
  // there the permission is automatically granted, so no need to ask for it.
  if (notify.isSupported
    && notify.permissionLevel() === notify.PERMISSION_DEFAULT
    && (typeof window.external === 'undefined' || typeof window.external.msIsSiteMode === 'undefined')) {
    this.reduxEmitter.showAlert({
      level: 'info',
      type: alerts.NOTIFICATIONS_REMINDER
    })
    classes(qs('body')).add('notifications-disabled')
  }

  if (!this.options.detached) {
    this.renderIntro()
  }

  // check timezone
  this.tz = timezone.determine().name()
  this.notificationSessionSet = false
  this.firstTimeConnect = true
}

UI.prototype.bind = function UI_bind() {
  pipeEvents(this)
  this.room = null
}

UI.prototype.renderIntro = function () {
  const self = this
  // initialize user guide
  this.intro = new Introjs()
  this.intro.onchange((el) => {
    if (window.analytics && el.dataset.step !== undefined) {
      window.analytics.track('Viewed Tutorial Step', {step: el.dataset.step, topic: el.dataset.topic})
    }
  })
  this.intro.setOptions({
    nextLabel: `<strong class="btn-nextStep">${_('Continue')}</strong>`,
    skipLabel: `${_('Already done?')} <u>${_('Skip tutorial')}</u>`,
    overlayOpacity: 0.005,
    showStepNumbers: false,
    showProgress: true,
    showBullets: false,
    steps: [
      {
        intro: `<img style="float: right; margin-left: 10px" width="135" height="160" src="${staticUrl('images/mascot/mascot.png')}"><div style="overflow: hidden"><h2>${_('Welcome')}</h2><p>${_('Grape is a chat application for teams. We help you to make your team communication more efficient, productive and fun.')}</p><p>${_('If you haven\'t used Grape already, we recommend you to take our 90 seconds tutorial.')}</p></div><div style="clear:both"></div>`,
        tooltipClass: 'intro-welcome'
      },
      {
        element: '#intro-step1',
        intro: `<img style="float: right; margin-top: 10px" width="110" height="130" src="${staticUrl('images/mascot/mascot_reading.png')}"><div style="overflow: hidden"><h2>${_('Find your team data')}</h2><p>${_('Search appointments, files and more from service integrations (like Google Apps or Exchange) or browse the web (e.g. GIFs).')}</p><p>${_('To open')} <strong>${_('Grape Search')}</strong> ${_('click the button or press')} <strong>#</strong></p> </div><div style="clear:both;"></div>`,
        tooltipClass: 'intro-step-1',
        tooltipPosition: 'right',
        position: 'top'
      },
      {
        element: '#intro-step2',
        intro: `<img style="float: right;margin-right: 10px" width="110" height="110" src="${staticUrl('images/mascot/mascot_lock_closed.png')}"><div style="overflow: hidden"><h2>${_('Manage chat rooms')}</h2><p>${_('Chat rooms can be public or private and can be based on projects, topics (e.g. daily lunch) or your departments (e.g. marketing).')}</p> </div><div style="clear:both;"></div>`,
        tooltipClass: 'intro-step-2',
        tooltipPosition: 'top',
        position: 'botom'
      },
      {
        element: '#intro-step3',
        intro: `<img style="float: right; margin-left: 10px" width="120" height="120" src="${staticUrl('images/mascot/mascot_message.png')}"><div style="overflow: hidden"><h2>${_('Communicate 1-to-1')}</h2><p>${_('Start quickly private conversations with your colleagues - even if they haven’t joined Grape yet.')}</p></div><div style="clear:both;"></div>`,
        tooltipClass: 'intro-step-3',
        tooltipPosition: 'top',
        position: 'bottom'
      },
      {
        element: '#intro-step4',
        intro: `<img style="float: right; margin-left: 10px" width="102" height="120" src="${staticUrl('images/mascot/mascot_playing.png')}"><div style="overflow: hidden"><h2>${_('Stay productive')}</h2><p>${_('Search conversations, browse your mentions or view shared files - these handy helpers make your life a lot easier.')}</p></div><div style="clear:both;"></div>`,
        tooltipClass: 'intro-step-4',
        tooltipPosition: 'top',
        position: 'bottom'
      },
      {
        intro: `<img style="float: right; margin-left: 10px; border-radius: 50%; -moz-border-radius: 50%; margin-top: 33px;" width="120" height="120" src="${staticUrl('images/mascot/gifs/trauby_space_sml.gif')}"><div style="overflow: hidden"><h2>${_('Well done!')}</h2><p>${_('Don\'t forget to')} <a href="/accounts/organization/settings/members/" target="_blank">${_('add your team members')}</a> ${_('and to')} <a href="/integrations/" target="_blank">${_('connect your services')}</a>.</p><p>${_('If you have any question, do not hesitate to write us by clicking the question mark on the top right corner.')}</p></div><div style="clear:both;height:1px;width:720px"></div>`,
        tooltipClass: 'intro-step-5'
      }
    ]
  })
  // intro
  this.intro.oncomplete(() => {
    self.emit('introend')
    reduxEmitter.showManageGroups()
  })
  this.intro.onexit(() => {
    self.emit('introend')
    reduxEmitter.showManageGroups()
  })
}

UI.prototype.requestPermission = function () {
  notify.requestPermission((permission) => {
    if (permission !== 'default') {
      classes(qs('body')).remove('notifications-disabled')
    }
  })
}

UI.prototype.setOrganization = function UI_setOrganization(org) {
  this.org = org
  template.locals.org = this.org
  this.emit('orgReady', this.org)
  setUpRouter(this)
  this.setNotificationsSession()
  if (this.notificationSessionSet === true) return
  focus.on('focus', this.setNotificationsSession.bind(this))
  this.notificationSessionSet = true
}

UI.prototype.setUser = function UI_setUser(user) {
  // the first time setUser will be called it hopefully contains the current
  // user and not another one
  if (this.user === undefined || user.id === this.user.id) {
    this.user = user
    template.locals.user = user
    this.emit('setUser', user)
  }
}

UI.prototype.setSettings = function UI_setSettings(settings) {
  this.settings = settings

  this.emit('settingsReady')

  // javscript timezone should always override server timezone setting?
  if (!this.settings.timezone || this.settings.timezone != this.tz) {
    this.emit('timezonechange', this.tz)
  }
}

UI.prototype.showIntro = function UI_showIntro(options = {}) {
  if (!this.settings) return
  const show = options.force || this.settings.show_intro
  if (show && !this.options.detached) {
    this.intro.start()
  }
}


UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
  const self = this
  const org = orgs.filter((o) => {
    if (o.id === self.options.organizationId) return o
  })[0]
  this.emit('selectorganization', org)
}

UI.prototype.setNotificationsSession = function UI_setNotificationsSession() {
  if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
    this.emit('setNotificationsSession', this.org.id)
  }
}

UI.prototype.roomCreated = function UI_roomCreated(room) {
  const self = this
  self.emit('joinroom', room, () => {
    page(`/chat/${room.slug}`)
    self.emit('endRoomCreation')
  })
}

UI.prototype.gotError = function UI_gotError(err) {
  this.reduxEmitter.showToastNotification(err.message)
}

UI.prototype.setRoomContext = function UI_setRoomContext(room) {
  this.room = room
}

UI.prototype.toggleDeleteRoomDialog = function UI_toggleDeleteRoomDialog(room) {
  const deleteRoomDialog = new DeleteRoomDialog({
    room
  }).closable().overlay().show()
  broker.pass(deleteRoomDialog, 'deleteroom', this, 'deleteroom')
}

UI.prototype.leftChannel = function UI_leftChannel(room) {
  if (this.room != room) return
  page.replace('/chat/')
}

UI.prototype.channelUpdate = function UI_channelUpdate(room) {
  if (this.room != room) return
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

UI.prototype.onSwitchToChatMode = function UI_onSwitchToChatMode(room) {
  const redirectSlug = room.type === 'pm' ? `@${room.users[0].username.toLowerCase()}` : room.slug
  page(`/chat/${redirectSlug}`)
}

UI.prototype.onInvalidUrl = function (cause) {
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

UI.prototype.onShowSidebar = function () {
  classes(this.clientBody).add('right-sidebar-show')
}

UI.prototype.onHideSidebar = function () {
  classes(this.clientBody).remove('right-sidebar-show')
}
