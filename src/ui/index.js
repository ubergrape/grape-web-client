let Emitter = require('emitter')
let broker = require('broker')
let qs = require('query')
let notification = require('notification')
let classes = require('classes')
let staticurl = require('staticurl')
let events = require('events')
let notify = require('HTML5-Desktop-Notifications')
let Introjs = require("intro.js").introJs
let Clipboard = require('clipboard')
let dropAnywhere = require('drop-anywhere')
let debounce = require('debounce')
let timezone = require('./jstz')
let focus = require('./focus')
let pipeEvents = require('./pipeEvents')
let page = require('page')
let setUpRouter = require('../init-router')
let template = require('template')
let _ = require('t')
let v = require('virtualdom')
let conf = require('conf')

let exports = module.exports = UI

require("startswith")
require("endswith")

exports.ItemList = require('./utils/itemlist')
let OrganizationPopover = exports.OrganizationPopover = require('./elements/popovers/organization')
let ChatHeader = exports.ChatHeader = require('./elements/chatheader')
let GrapeInput = exports.GrapeInput = require('./elements/GrapeInput')
let HistoryView = exports.HistoryView = require('./elements/historyview')
let FileUploader = exports.FileUploader = require('./elements/fileuploader')
let Notifications = exports.Notifications = require('./elements/notifications')
let Dropzone = exports.Dropzone = require('./elements/dropzone.js')
let DeleteRoomDialog = exports.DeleteRoomDialog = require('./elements/dialogs/deleteroom')
let MarkdownTipsDialog = exports.MarkdownTipsDialog = require('./elements/dialogs/markdowntips')
let RoomManager = exports.RoomManager = require('./elements/dialogs/roommanager')
let PMManager = exports.PMManager = require('./elements/dialogs/pmmanager')
let OrgInvite = exports.OrgInvite = require('./elements/dialogs/OrgInvite')

import reduxEmitter from '../../react-components/redux-emitter'
import * as alerts from '../../react-components/constants/alerts'
import '../../react-components/app'

function UI(options) {
  Emitter.call(this)
  this.options = options || {}
  this.init()
  this.bind()
}

UI.prototype = Object.create(Emitter.prototype)

UI.prototype.init = function UI_init() {
  // set the current language
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

  this.el = v.toDOM(template('index.jade'))

  this.clientBody = qs('.client-body', this.el)

  this.organizationMenu = new OrganizationPopover()

  this.chatHeader = new ChatHeader()
  qs('.room-header', this.el).appendChild(this.chatHeader.el)

  // initialize the input field
  this.grapeInput = new GrapeInput()
  qs('.footer', this.el).appendChild(this.grapeInput.el)

  this.reduxEmitter = reduxEmitter

  // initialize dialogs
  this.markdownTips = new MarkdownTipsDialog().closable()

  this.historyView = new HistoryView()
  let chat = qs('.chat-wrapper .chat', this.el)
  chat.parentNode.replaceChild(this.historyView.el, chat)

  qs('.chat-wrapper', this.el).appendChild(document.createElement('grape-alerts'))

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
  this.dropzone = new Dropzone()
  this.dragAndDrop = dropAnywhere(function (e) {
    e.items.forEach(function (item) {
      self.emit('uploadDragged', item)
    })
  }, this.dropzone.el)

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

  // show user title if it is enabled
  if (conf.userTitleEnabled) classes(qs('body')).add('user-title-enabled')

  // initialize user guide
  this.intro = new Introjs()
  this.intro.onchange(function (el) {
    if (el.dataset.step !== undefined) {
      window.analytics.track("Viewed Tutorial Step", {step: el.dataset.step, topic: el.dataset.topic})
    }
  })
  this.intro.setOptions({
    nextLabel: '<strong class="btn-nextStep">' + _('Continue') + '</strong>',
    skipLabel: _('Already done? <u>Skip tutorial</u>'),
    overlayOpacity: 0.005,
    showStepNumbers: false,
    showProgress: true,
    showBullets: false,
    steps: [
      {
        intro: _('<img style="float: right; margin-left: 10px" width="135" height="160" src="'+ staticurl("images/mascot/mascot.png") +'"><div style="overflow: hidden"><h2>Welcome</h2><p>Grape is a chat application for teams. We help you to make your team communication more efficient, productive and fun.</p><p>If you haven\'t used Grape already, we recommend you to take our 90 seconds tutorial.</p></div><div style="clear:both"></div>'),
        tooltipClass: "intro-welcome"
      },
      {
        element: '#intro-step1',
        intro: _('<img style="float: right; margin-top: 10px" width="110" height="130" src="'+ staticurl("images/mascot/mascot_reading.png") +'"><div style="overflow: hidden"><h2>Find your team data</h2><p>Search appointments, files and more from service integrations (like Google Apps or Exchange) or browse the web (e.g. GIFs).</p><p>To open <strong>Grape Search</strong> click the button or press <strong>#</strong></p> </div><div style="clear:both;"></div>'),
        tooltipClass: "intro-step-1",
        tooltipPosition: 'right',
        position: 'top'
      },
      {
        element: '#intro-step2',
        intro: _('<img style="float: right;margin-right: 10px" width="110" height="110" src="'+ staticurl("images/mascot/mascot_lock_closed.png") +'"><div style="overflow: hidden"><h2>Manage chat rooms</h2><p>Chat rooms can be public or private and can be based on projects, topics (e.g. daily lunch) or your departments (e.g. marketing).</p> </div><div style="clear:both;"></div>'),
        tooltipClass: "intro-step-2",
        position: 'right'
      },
      {
        element: '#intro-step3',
        intro: _('<img style="float: right; margin-left: 10px" width="120" height="120" src="'+ staticurl("images/mascot/mascot_message.png") +'"><div style="overflow: hidden"><h2>Communicate 1-to-1</h2><p>Start quickly private conversations with your colleagues - even if they haven’t joined Grape yet.</p></div><div style="clear:both;"></div>'),
        position: 'right',
        tooltipClass: "intro-step-3"
      },
      {
        element: '#intro-step4',
        intro: _('<img style="float: right; margin-left: 10px" width="102" height="120" src="'+ staticurl("images/mascot/mascot_playing.png") +'"><div style="overflow: hidden"><h2>Stay productive</h2><p>Search conversations, browse your mentions or view shared files - these handy helpers make your life a lot easier.</p></div><div style="clear:both;"></div>'),
        tooltipClass: "intro-step-4",
        position: 'bottom'
      },
      {
        intro: _('<img style="float: right; margin-left: 10px; border-radius: 50%; -moz-border-radius: 50%; margin-top: 33px;" width="120" height="120" src="'+ staticurl("images/mascot/gifs/trauby_space_sml.gif") +'"><div style="overflow: hidden"><h2>Well done!</h2><p>Don\'t forget to <a href="/accounts/organization/settings/members/" target="_blank">add your team members</a> and to <a href="/integrations/" target="_blank">connect your services</a>.</p><p>If you have any question, do not hesitate to write us by clicking the question mark on the top right corner.</p></div><div style="clear:both;height:1px;width:720px"></div>'),
        tooltipClass: "intro-step-5"
      }
    ]
  })

  // check timezone
  this.tz = timezone.determine().name()
  this.notificationSessionSet = false
  this.firstTimeConnect = true
  this.uploadRoom = null
}

UI.prototype.bind = function UI_bind() {
  pipeEvents(this)
  let self = this

  this.events = events(this.el, {
    'closeNotificationsMessage': function() {
      self.enableNotificationMessage.remove()
    }
  })

  this.events.bind('click .close_notifications_message', 'closeNotificationsMessage')

  this.room = null

  // intro
  this.intro.oncomplete(function () {
    self.emit('introend')
  })
  this.intro.onexit(function () {
    self.emit('introend')
  })
}

UI.prototype.requestPermission = function () {
  notify.requestPermission(permission => {
    if (permission !== 'default') {
      this.enableNotificationMessage.remove()
      classes(qs('body')).remove('notifications-disabled')
    }
  })
}

const rightSidebarComponents = [
  'user-profile',
  'channel-info',
  'shared-files',
  'mentions',
  'message-search'
]

/**
 * Render all right sidebar components.
 */
UI.prototype.renderSidebar = function() {
  if (this.rightSidebar) return
  const el = document.createElement('div')
  el.className = 'right-sidebar'
  this.clientBody.appendChild(el)
  rightSidebarComponents.forEach(name => {
    el.appendChild(document.createElement(`grape-${name}`))
  })
  this.rightSidebar = el
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
  this.renderSidebar()
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
  if (this.settings.show_intro) {
    window.analytics.track("Started Tutorial", {via: "onboarding"})
    this.intro.start()
  }

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

UI.prototype.setOrganizations = function UI_setOrganizations(orgs) {
  let self = this
  let org = orgs.filter(function (o) {
    if (o.id === self.options.organizationID) return o
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
  notification.error(err.message)
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

UI.prototype.onToggleOrgInvite = function () {
  let invite = new OrgInvite().closable().overlay().show()
  broker(this, 'inviteSuccess', invite, 'onInviteSuccess')
  broker(this, 'inviteError', invite, 'onInviteError')
  broker.pass(invite, 'inviteToOrg', this, 'inviteToOrg')
}

UI.prototype.showMarkdownTips = function UI_showMarkdownTips() {
  this.markdownTips.overlay().show()
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
  broker.pass(roommanager, 'createRoom', this, 'createRoom')
  broker(this, 'leftChannel', roommanager, 'onLeftChannel')
  broker(this, 'joinedChannel', roommanager, 'onJoinedChannel')
  broker(this, 'roomCreationError', roommanager, 'onRoomCreationError')
  broker(this, 'newRoom', roommanager, 'onNewRoom')
  broker(this, 'channelupdate', roommanager, 'onChannelUpdate')
  broker(this, 'endRoomCreation', roommanager, 'onEndRoomCreation')
}

UI.prototype.onTriggerPMManager = function () {
  let pmmanager = new PMManager({
    users: this.org.users.slice()
  }).closable().overlay().show()
  broker(this, 'selectchannel', pmmanager, 'end')
  broker(this, 'changeUser', pmmanager, 'onChangeUser')
  broker(this, 'newOrgMember', pmmanager, 'onNewOrgMember')
}

UI.prototype.onShowSidebar = function () {
    classes(this.clientBody).add('right-sidebar-show')
}

UI.prototype.onHideSidebar = function () {
  classes(this.clientBody).remove('right-sidebar-show')
}
