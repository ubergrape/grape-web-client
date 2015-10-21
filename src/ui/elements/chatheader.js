let Emitter = require('emitter')
let template = require('template')
let qs = require('query')
let events = require('events')
let render = require('../rendervdom')
let debounce = require('debounce')
let classes = require('classes')
let constants = require('conf').constants
let keyname = require('keyname')
let hexToRgb = require('color-converter')

module.exports = ChatHeader

function ChatHeader() {
  Emitter.call(this)
  this.room = new Emitter({name: '', users: []})
  this.redraw = this.redraw.bind(this)
  this.redraw()
  this.init()
  this.bind()
}

ChatHeader.prototype = Object.create(Emitter.prototype)

ChatHeader.prototype.init = function ChatHeader_init() {
  this.classes = classes(this.el)
  this.searchForm = qs('.search-form', this.el)
  this.searchInput = qs('.search', this.el)
  this.menuToggle = qs('#menuToggle', this.el)
  this.q = null
  this.isRoomManager = false
  this.editState = {
    renaming: false,
    editingDescription: false
  }
  this.mode = 'chat'
  if (window.CHATGRAPE_CONFIG['customSupportEmailAddress'] !== '') {
    // we don't use window.intercomSettings.widget.activator here because intercom settings are not availble for organizations which have custom support address. --> "#Intercom" is hardcoded
    let intercomButton = qs('a#Intercom', this.el)
    intercomButton.href = 'mailto:' + window.CHATGRAPE_CONFIG['customSupportEmailAddress']
  } else if (typeof Intercom !== 'undefined') {
    let intercomButton = qs('a' + window.intercomSettings.widget.activator, this.el)
    intercomButton.href = 'mailto:' + window.intercomSettings.app_id + '@incoming.intercom.io'
    window.Intercom('reattach_activator')
  }
}

ChatHeader.prototype.bind = function ChatHeader_bind() {
  let self = this

  this.events = events(this.el, {
    'toggleDeleteRoomDialog': function (e) {
      self.emit('toggledeleteroomdialog', self.room)
    },
    'triggerRoomRename': function () {
      self.editState.renaming = true
      self.redraw()
      let roomNameInput = qs('input.room-name', this.el)
      let roomName = roomNameInput.value
      roomNameInput.focus()
      roomNameInput.setSelectionRange(roomName.length,roomName.length)
    },
    'stopRoomRename': function () {
      self.editState.renaming = false
      self.redraw()
    },
    'confirmRoomRename': function () {
      let newRoomName = qs('input.room-name', this.el).value
      self.emit('confirmroomrename', self.room.id, newRoomName)
    },
    'roomRenameShortcuts' : function (e) {
      switch(keyname(e.keyCode)) {
        case 'enter':
          this.confirmRoomRename()
        default:
          e.target.setCustomValidity('')
      }
    },
    'preventFormSubmission' : function (e) {
      e.preventDefault()
    },
    'toggleMenu' : function (e) {
      let color = {r: 100, g: 50, b: 100}

      if (self.room.color) {
        color = hexToRgb(self.room.color.toLowerCase())
      }

      if (self.menuToggle.className === "room-header-button") {
        self.emit('togglerightsidebar')
        self.menuToggle.className = "room-header-button-active"
        self.menuToggle.style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.75)"
      } else {
        self.menuToggle.className = "room-header-button"
        self.menuToggle.style.background = ""
        self.emit('togglerightsidebar')
      }

      qs('.right-sidebar-room-info').style.display = "block"
    },
    'triggerDescriptionEdit': function (e) {
      self.editState.editingDescription = true
      self.redraw()
      let inputDescription = qs('input.description', this.el)
      // unfortunately our events.bind method has no support or
      // does not work for blur events, so here is a workaround
      inputDescription.removeEventListener('blur', this.stopDescriptionEdit)
      inputDescription.focus()
      inputDescription.addEventListener('blur', this.stopDescriptionEdit)
    },
    'stopDescriptionEdit': function () {
      self.editState.editingDescription = false
      self.redraw()
    },
    'setDescription': function (e) {
      if (keyname(e.keyCode) != 'enter') return
      self.emit('setDescription', self.room, e.target.value)
    }
  })

  this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog')
  this.events.bind('click div.room-name.editable', 'triggerRoomRename')
  this.events.bind('click .option-rename-cancel', 'stopRoomRename')
  this.events.bind('click .option-rename-ok', 'confirmRoomRename')
  this.events.bind('click #menuToggle', 'toggleMenu')
  this.events.bind('keyup input.room-name', 'roomRenameShortcuts')
  this.events.bind('keyup input.description', 'setDescription')
  this.events.bind('submit form', 'preventFormSubmission')
  this.events.bind('click .description-edit', 'triggerDescriptionEdit')

  let  callbacks = this.events.obj

  document.addEventListener('keyup', function (e) {
    if (keyname(e.which) === 'esc') callbacks.stopRoomRename()
  })

  let startSearching = debounce(function () {
    self.emit('searching', self.q)
  }, 200, false)

  this.searchInput.addEventListener('keyup', function () {
    let q = (qs('input.search', self.el).value || this.value).replace(/^\s+|\s+$/g, '')
    if (q.length !== 0 && self.q !== q) {
      self.q = q
      startSearching()
    } else if (q.length === 0 && self.q !== q) {
      self.q = q
      self.emit("stopsearching")
    }
  })
}

ChatHeader.prototype.redraw = function ChatHeader_redraw() {
  let color = {r: 100, g: 50, b: 100}

  if (this.room.color) {
    color = hexToRgb(this.room.color.toLowerCase())
  }

  let vdom = template('chatheader.jade', {
    room: this.room,
    isRoomManager: this.isRoomManager,
    editState: this.editState,
    mode: this.mode,
    color: color
  })

  render(this, vdom)

  if (qs('.room-header-button-active')) {
    qs('.room-header-button-active').style.background = "rgba(" + color.r + ", " + color.g + ", " + color.b + ", 0.75)"
  }
}

ChatHeader.prototype.clearSearch = function ChatHeader_clearSearch() {
  this.searchInput.value = ''
}

ChatHeader.prototype.setRoom = function ChatHeader_setRoom(room, msgID) {
  this.room = room
  this.isRoomManager = (this.room.creator && window.ui.user === this.room.creator) || window.ui.user.role >= constants.roles.ROLE_ADMIN
  this.editState.renaming = false
  this.mode = msgID ? 'search' : 'chat'
  this.redraw()
}

ChatHeader.prototype.channelUpdate = function ChatHeader_channelUpdate (room) {
  if (this.room != room) return
  this.editState.editingDescription = false
  this.editState.renaming = false
  this.redraw()
}

ChatHeader.prototype.roomRenameError = function ChatHeader_roomRenameError(err) {
  qs('input.room-name', this.el).setCustomValidity(err.message)
  qs('input.submit-rename', this.el).click()
}

ChatHeader.prototype.onNewRoomMember = function ChatHeader_onNewRoomMember(room) {
  if (room === this.room) this.redraw()
}

ChatHeader.prototype.onMemberLeftChannel = function ChatHeader_onMemberLeftChannel(room) {
  if (room === this.room) this.redraw()
}

ChatHeader.prototype.onSwitchToChatMode = function ChatHeader_onSwitchToChatMode () {
  this.mode = 'chat'
  this.redraw()
}

ChatHeader.prototype.onSwitchToSearchMode = function ChatHeader_onSwitchToChatMode () {
  this.mode = 'search'
  this.redraw()
}
