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
let Navigation = exports.Navigation = require('./elements/navigation')
let OrganizationPopover = exports.OrganizationPopover = require('./elements/popovers/organization')
let ChatHeader = exports.ChatHeader = require('./elements/chatheader')
let GrapeInput = exports.GrapeInput = require('./elements/GrapeInput')
let HistoryView = exports.HistoryView = require('./elements/historyview')
let Title = exports.Title = require('./titleupdater')
let FileUploader = exports.FileUploader = require('./elements/fileuploader')
let Messages = exports.Messages = require('./utils/messages')
let Notifications = exports.Notifications = require('./elements/notifications')
let Dropzone = exports.Dropzone = require('./elements/dropzone.js')
let DeleteRoomDialog = exports.DeleteRoomDialog = require('./elements/dialogs/deleteroom')
let MarkdownTipsDialog = exports.MarkdownTipsDialog = require('./elements/dialogs/markdowntips')
let RoomInvite = exports.RoomInvite = require('./elements/dialogs/RoomInvite')
let RoomManager = exports.RoomManager = require('./elements/dialogs/roommanager')
let PMManager = exports.PMManager = require('./elements/dialogs/pmmanager')
let OrgInvite = exports.OrgInvite = require('./elements/dialogs/OrgInvite')

import reduxEmitter from '../../react-components/redux-emitter'
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

  // add the navigation to the layout
  let sidebar = qs('.navigation', this.el)
  let navigation = this.navigation = new Navigation()
  sidebar.parentNode.replaceChild(navigation.el, sidebar)

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

  this.title = new Title()
  this.messages = new Messages()
  qs('.chat-wrapper', this.el).appendChild(this.messages.el)

  // All right sidebar elements.
  const rightSidebar = document.createElement('div')
  rightSidebar.className = 'right-sidebar'
  this.clientBody.appendChild(rightSidebar)
  rightSidebar.appendChild(document.createElement('grape-user-profile'))
  rightSidebar.appendChild(document.createElement('grape-channel-info'))
  rightSidebar.appendChild(document.createElement('grape-shared-files'))
  rightSidebar.appendChild(document.createElement('grape-mentions'))
  rightSidebar.appendChild(document.createElement('grape-message-search'))

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
      this.enableNotificationMessage = this.messages.info('notifications reminder')
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
    nextLabel: '<strong>' + _('Next') + '</strong>',
    skipLabel: _('Skip'),
    overlayOpacity: 0.7,
    showStepNumbers: false,
    showProgress: true,
    showBullets: false,
    steps: [
      {
        intro: _('<img style="float: left;margin-left: -10px" width="120" height="120" src="'+ staticurl("images/mascot/mascot_wave.png") +'"><div style="overflow: hidden"><h2>Hi '+ window.globalDisplayName +', welcome to ChatGrape!</h2><h3>My name is Trauby and I am here to give you a warm welcome at ChatGrape.</h3><p>The goal is to make your work life more <u>efficient</u>, <u>productive</u> and <u>enjoyable</u>. With the following 5 tips I will give you a quick overview of the chat and its nifty features.</p><p> If you want to talk to us, you can always reach out via <a target="_blank" href="mailto:support@chatgrape.com">support@chatgrape.com</a> or by tweeting at <a href="https://twitter.com/chatgrapecom" target="_blank">@chatgrapecom</a>.</p></div><div style="clear:both"></div>'),
        tooltipClass: "intro-welcome"
      },
      {
        element: '#intro-stepOne',
        intro: _('<img style="float: left;margin-left: -10px" width="110" height="130" src="'+ staticurl("images/mascot/mascot_playing.png") +'"><div style="overflow: hidden"><h2>Juggle your company from <u>one place</u></h2><h3>Access all your company data right from the chat.</h3><p>Add <u>Service Integrations</u> inside of your <u>Organization Settings</u> to make them available inside of ChatGrape. You can search some external websites right away:</p><p><ul class="ver-list"><li>Type <span class="example-text">#youtube: chatgrape</span> to search youtube,</li><li>or <span class="example-text">#gif: explosion</span> to search the internet for gifs.</li></ul></p><p><strong>But most importantly</strong>: Add your own company data in your <u>Organization Settings</u> to browse your files, tasks and appointments within ChatGrape.</p> </div><div style="clear:both;height:1px;width:720px"></div>'),
        position: 'top'
      },
      {
        element: '#intro-step2',
        intro: _('<img style="float: right;margin-right: -10px" width="110" height="130" src="'+ staticurl("images/mascot/mascot_reading.png") +'"><div style="overflow: hidden"><h2>Rooms are a <u>virtual profile of your company</u></h2><h3>Join and create rooms for projects and departments within your organization.</h3><p>You can create and join public and private rooms by clicking the <u>Manage Rooms</u> button in the corner.</p> </div><div style="clear:both;height:1px;width:550px"></div>'),
        position: 'right'
      },
      {
        element: '#intro-step3',
        intro: _('<h2>Communicate 1-on-1</h2><h3>Click on your team members to start private conversations</h3><p>The color dot indicates each user\'s current state:<ul class="ver-list"><li><strong>Green</strong>: The user is online</li><li><strong>Red</strong>: The user is currently not reachable</li><li><strong>Grey</strong>: The user has been removed from the organization</li></ul></p><p>Your private messages are sorted by latest interactions, pushing unread messages to the top.</p><div style="clear:both;height:1px;width:550px"></div>'),
        position: 'right',
        tooltipClass: 'introjs-push-arrow-bottom'
      },
      {
        element: '#intro-step4',
        intro: _('<h2>The Room header</h2><h3>At ChatGrape everything is just one click away.</h3><p>As an admin or room owner, you can modify a <u>Room Name</u> just by clicking the <i class="fa fa-pencil"></i> button.</p><p>You can <u>Delete Rooms</u> by clicking the <i class="fa fa-trash"></i> icon.</p><p>The little round images show the <u>users inside a room</u>. Click the <i class="fa fa-user-plus"></i> button to see all and to invite new users.</p>'),
        position: 'bottom'
      },
      {
        intro: _('<img style="float: left;margin-left: -10px" width="120" height="120" src="'+ staticurl("images/mascot/gifs/trauby_space_sml.gif") +'"><div style="overflow: hidden"><h2>ChatGrape - We Have Lift-off!</h2><h3>With the tutorial out of the way, it\'s now time to set up your organization.</h3><p><u>Manage your rooms</u>, invite your <u>team members</u> and <u>add service integrations</u> in your organization settings.</p><p>If you need help with the setup, don\'t hesitate and contact us right away!</p><p>Cheerio, <br>-Trauby</p></div><div style="clear:both;height:1px;width:720px"></div>'),
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
  let navigation = this.navigation

  this.events = events(this.el, {
    'toggleOrganizationMenu': function () {
      self.organizationMenu.toggle(qs('.settings-icon'))
    },
    'requestPermission': function () {
      notify.requestPermission(function (permission) {
        if (permission !== "default") {
          self.enableNotificationMessage.remove()
          classes(qs('body')).remove('notifications-disabled')
        }
      })
    }
  })

  this.events.bind('click .settings-icon', 'toggleOrganizationMenu')
  this.events.bind('click .enable_notifications', 'requestPermission')

  this.room = null

  // intro
  this.intro.oncomplete(function () {
    self.emit('introend')
  })
  this.intro.onexit(function () {
    self.emit('introend')
  })

  if (window.Intercom) {
    window.Intercom('onShow', function () {
      classes(qs('.client-body', this.el)).add('intercom-show')
    }.bind(this))
    window.Intercom('onHide', function () {
      classes(qs('.client-body', this.el)).remove('intercom-show')
    }.bind(this))
  }
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

UI.prototype.onDisconnected = function () {
  this.firstTimeConnect = false
  if (this._connErrMsg) return
  this._connErrMsg = this.messages.danger('connection lost')
  classes(qs('body')).add('disconnected')
}

UI.prototype.onConnected = function () {
  if (!this._connErrMsg || this.firstTimeConnect) return
  this._connErrMsg.remove()
  delete this._connErrMsg
  classes(qs('body')).remove('disconnected')
  let msg = this.messages.success('reconnected')
  setTimeout(function () { msg.remove() }, 2000)
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

UI.prototype.onToggleRoomInvite = function UI_onToggleRoomInvite (room) {
  // org users who are not part of the room, sorted alphabetically
  let users = this.org.users.filter(function (user) {
    return user.active && room.users.indexOf(user) === -1
  })
  let invite = new RoomInvite({
    org: this.org,
    users: users,
    room: room
  }).closable().overlay().show()

  broker.pass(invite, 'inviteToRoom', this, 'inviteToRoom')
  broker(this, 'roomInviteSuccess', invite, 'onRoomInviteSuccess')
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
  let redirectSlug = channel.type === 'pm' ? '@' + channel.users[0].slug : channel.slug
  page.redirect('/chat/' + redirectSlug)
  let msg = this.messages.warning('message not found')
  setTimeout(function () { msg.remove() }, 6000)
}

UI.prototype.onNotificationClicked = function UI_onNotificationClicked (channel) {
  if (this.room === channel) return
  let slug = channel.type === 'pm' ? '@' + channel.users[0].username.toLowerCase() : channel.slug
  page('/chat/' + slug)
}

UI.prototype.onSwitchToChatMode = function UI_onSwitchToChatMode (room) {
  let redirectSlug = room.type === 'pm' ? '@' + room.users[0].username.toLowerCase() : room.slug
  page('/chat/' + redirectSlug)
}

UI.prototype.onInvalidUrl = function(cause) {
  const msg = this.messages.warning(cause)
  page.redirect('/chat/')
  setTimeout(() => msg.remove(), 6000)
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
