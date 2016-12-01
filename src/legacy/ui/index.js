let Emitter = require('emitter')
let broker = require('broker')
let qs = require('query')
let classes = require('classes')
let staticurl = require('staticurl')
let events = require('events')
let notify = require('html5-desktop-notifications')
let Introjs = require("intro.js").introJs
import Clipboard from 'clipboard';
import dropAnywhere from 'drop-anywhere';
import timezone from './jstz';
import focus from './focus';
import pipeEvents from './pipeEvents';
import page from 'page';
import setUpRouter from '../init-router';
import template from 'template';
import v from 'virtualdom';

import ItemList from './utils/itemlist';
import OrganizationPopover from './elements/popovers/organization';
import GrapeInput from './elements/GrapeInput';
import FileUploader from './elements/fileuploader';
import Notifications from './elements/notifications';
import Dropzone from './elements/dropzone.js';
import DeleteRoomDialog from './elements/dialogs/deleteroom';
import RoomManager from './elements/dialogs/roommanager';


require("startswith")
require("endswith")

// Legacy translation tool requires a _ variable untouched by webpack.
const _ = require('t')

let exports = module.exports = UI

exports.ItemList = ItemList
exports.OrganizationPopover = OrganizationPopover
exports.GrapeInput = GrapeInput
exports.FileUploader = FileUploader
exports.Notifications = Notifications
exports.Dropzone = Dropzone
exports.DeleteRoomDialog = DeleteRoomDialog
exports.RoomManager = RoomManager

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
  template.locals.staticurl = staticurl
  // initialize user and org with dummy image
  template.locals.user = {
    avatar: staticurl("images/orga-image-load.gif"),
    username: "Loading",
    displayName: "Loading"
  }
  template.locals.org = {
    logo: staticurl("images/orga-image-load.gif"),
    name: "Loading"
  }

  this.organizationMenu = new OrganizationPopover()

  // initialize the input field
  this.grapeInput = new GrapeInput()

  this.reduxEmitter = reduxEmitter

  this.upload = new FileUploader(this.options.uploadPath)
  let uploadContainer = qs('.uploader', this.grapeInput.el)
  uploadContainer.parentNode.replaceChild(this.upload.el, uploadContainer)

  this.clipboard = new Clipboard(window)

  // on paste, check if the pasted item is a blob object -image-,
  // then emit an upload event to the broker to call the uploader
  this.clipboard.on('paste', function (e) {
    if(e.items[0] instanceof Blob) this.emit('upload', e.items[0])
  })

  // initialize dragAndDrop
  // receive the dragged items and emit
  // an event to the uploader to upload them
  let self = this
  if (!this.options.detached) {
    this.dropzone = new Dropzone()
    this.dragAndDrop = dropAnywhere(function (e) {
      e.items.forEach(function (item) {
        self.emit('uploadDragged', item)
      })
    }, this.dropzone.el)
  }
  // initialize notifications
  this.notifications = new Notifications()
  // only show notification info bar in supported browsers and only if the
  // user has't accepted or declined notifications before
  // don't show it in IE. it only supports notifications in "SiteMode" and
  // there the permission is automatically granted, so no need to ask for it.
  if (notify.isSupported
    && notify.permissionLevel() === notify.PERMISSION_DEFAULT
    && (typeof window.external === "undefined" || typeof window.external.msIsSiteMode === "undefined")) {
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
  this.uploadRoom = null
}

UI.prototype.bind = function UI_bind() {
  pipeEvents(this)
  this.room = null
}

UI.prototype.renderIntro = function() {
  const self = this
  // initialize user guide
  this.intro = new Introjs()
  this.intro.onchange(function (el) {
    if (window.analytics && el.dataset.step !== undefined) {
      window.analytics.track("Viewed Tutorial Step", {step: el.dataset.step, topic: el.dataset.topic})
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
        intro: `<img style="float: right; margin-left: 10px" width="135" height="160" src="${staticurl('images/mascot/mascot.png')}"><div style="overflow: hidden"><h2>${_('Welcome')}</h2><p>${_('Grape is a chat application for teams. We help you to make your team communication more efficient, productive and fun.')}</p><p>${_('If you haven\'t used Grape already, we recommend you to take our 90 seconds tutorial.')}</p></div><div style="clear:both"></div>`,
        tooltipClass: "intro-welcome"
      },
      {
        element: '#intro-step1',
        intro: `<img style="float: right; margin-top: 10px" width="110" height="130" src="${staticurl('images/mascot/mascot_reading.png')}"><div style="overflow: hidden"><h2>${_('Find your team data')}</h2><p>${_('Search appointments, files and more from service integrations (like Google Apps or Exchange) or browse the web (e.g. GIFs).')}</p><p>${_('To open')} <strong>${_('Grape Search')}</strong> ${_('click the button or press')} <strong>#</strong></p> </div><div style="clear:both;"></div>`,
        tooltipClass: "intro-step-1",
        tooltipPosition: 'right',
        position: 'top'
      },
      {
        element: '#intro-step2',
        intro: `<img style="float: right;margin-right: 10px" width="110" height="110" src="${staticurl('images/mascot/mascot_lock_closed.png')}"><div style="overflow: hidden"><h2>${_('Manage chat rooms')}</h2><p>${_('Chat rooms can be public or private and can be based on projects, topics (e.g. daily lunch) or your departments (e.g. marketing).')}</p> </div><div style="clear:both;"></div>`,
        tooltipClass: "intro-step-2",
        tooltipPosition: 'top',
        position: 'botom'
      },
      {
        element: '#intro-step3',
        intro: `<img style="float: right; margin-left: 10px" width="120" height="120" src="${staticurl('images/mascot/mascot_message.png')}"><div style="overflow: hidden"><h2>${_('Communicate 1-to-1')}</h2><p>${_('Start quickly private conversations with your colleagues - even if they haven’t joined Grape yet.')}</p></div><div style="clear:both;"></div>`,
        tooltipClass: "intro-step-3",
        tooltipPosition: 'top',
        position: 'bottom'
      },
      {
        element: '#intro-step4',
        intro: `<img style="float: right; margin-left: 10px" width="102" height="120" src="${staticurl('images/mascot/mascot_playing.png')}"><div style="overflow: hidden"><h2>${_('Stay productive')}</h2><p>${_('Search conversations, browse your mentions or view shared files - these handy helpers make your life a lot easier.')}</p></div><div style="clear:both;"></div>`,
        tooltipClass: "intro-step-4",
        tooltipPosition: 'top',
        position: 'bottom'
      },
      {
        intro: `<img style="float: right; margin-left: 10px; border-radius: 50%; -moz-border-radius: 50%; margin-top: 33px;" width="120" height="120" src="${staticurl('images/mascot/gifs/trauby_space_sml.gif')}"><div style="overflow: hidden"><h2>${_('Well done!')}</h2><p>${_('Don\'t forget to')} <a href="/accounts/organization/settings/members/" target="_blank">${_('add your team members')}</a> ${_('and to')} <a href="/integrations/" target="_blank">${_('connect your services')}</a>.</p><p>${_('If you have any question, do not hesitate to write us by clicking the question mark on the top right corner.')}</p></div><div style="clear:both;height:1px;width:720px"></div>`,
        tooltipClass: "intro-step-5"
      }
    ]
  })
  // intro
  this.intro.oncomplete(function () {
    self.emit('introend')
    reduxEmitter.showChannelsManager()
  })
  this.intro.onexit(function () {
    self.emit('introend')
    reduxEmitter.showChannelsManager()
  })
}

UI.prototype.requestPermission = function () {
  notify.requestPermission(permission => {
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

  if (this.settings.compact_mode) {
    classes(document.body).add('client-style-compact')
    classes(document.body).remove('normal-style')
    classes(document.body).remove('client-style-normal')
  } else {
    classes(document.body).add('normal-style')
    classes(document.body).remove('client-style-compact')
    classes(document.body).add('client-style-normal')
  }

  if (this.settings.dark_mode) {
    classes(document.body).add('dark')
  }

  this.emit('settingsReady')

  // javscript timezone should always override server timezone setting?
  if (!this.settings.timezone || this.settings.timezone != this.tz) {
    this.emit('timezonechange', this.tz)
  }
}

UI.prototype.showIntro = function UI_showIntro(settings) {
  if (!this.settings) return
  if (this.settings.show_intro && !this.options.detached) {
    this.intro.start()
    if (window.analytics) window.analytics.track("Started Tutorial", {via: "onboarding"})
  }
}


UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
  let self = this
  let org = orgs.filter(function (o) {
    if (o.id === self.options.organizationId) return o
  })[0]
  this.emit('selectorganization', org)
}

UI.prototype.setNotificationsSession = function UI_setNotificationsSession() {
  if(notify.permissionLevel() === notify.PERMISSION_GRANTED) {
    this.emit('setNotificationsSession', this.org.id)
  }
}

UI.prototype.roomCreated = function UI_roomCreated(room) {
  let self = this
  self.emit('joinroom', room, function () {
    page('/chat/' + room.slug)
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
  let deleteRoomDialog = new DeleteRoomDialog({
    room: room
  }).closable().overlay().show()
  broker.pass(deleteRoomDialog, 'deleteroom', this, 'deleteroom')
}

UI.prototype.leftChannel = function UI_leftChannel(room) {
  if (this.room != room) return
  page.replace('/chat/')
}

UI.prototype.channelUpdate = function UI_channelUpdate(room) {
  if(this.room != room) return
  page.replace('/chat/' + room.slug)
}

UI.prototype.onUploading = function () {
  this.uploadRoom = this.room
}

UI.prototype.onUploaded = function (attachment) {
  this.emit('send', this.uploadRoom, '', {attachments: [attachment.id]})
  this.upload.hide()
}

UI.prototype.onMessageNotFound = function UI_onMessageNotFound (channel) {
  // TODO: need to be fixed before PR accepted!
  let redirectSlug = channel.type === 'pm' ? channel.users[0].slug : channel.slug

  page.redirect('/chat/' + redirectSlug)
  this.reduxEmitter.showAlert({
    level: 'warning',
    type: alerts.MESSAGE_NOT_FOUND,
    closeAfter: 6000
  })
}

UI.prototype.onSwitchToChatMode = function UI_onSwitchToChatMode (room) {
  let redirectSlug = room.type === 'pm' ? '@' + room.users[0].username.toLowerCase() : room.slug
  page('/chat/' + redirectSlug)
}

UI.prototype.onInvalidUrl = function(cause) {
  page.redirect('/chat/')
  this.reduxEmitter.showAlert({
    level: 'warning',
    type: cause,
    closeAfter: 6000
  })
}

UI.prototype.onTriggerRoomManager = function UI_onTriggerRoomManager () {
  let roommanager = new RoomManager({
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
