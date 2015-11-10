let Emitter = require('emitter')
let template = require('template')
let qs = require('query')
let events = require('events')
let render = require('../rendervdom')
let debounce = require('lodash/function/debounce')
let classes = require('classes')
let constants = require('conf').constants
let keyname = require('keyname')
let conf = require('conf')

module.exports = ChatHeader


const menuItems = {
  intercom: {
    className: 'intercom-trigger',
    icon: 'fa-question-circle',
    id: 'Intercom',
    visible: true
  },
  mentions: {
    className: 'mentions-toggler',
    type: 'mentions',
    //icon: 'fa-files-o',
    visible: true
  },
  sharedFiles: {
    className: 'file-browser-toggler',
    icon: 'fa-files-o',
    visible: true
  },
  user: {
    className: 'user-view-toggler',
    icon: 'fa-user',
    visible: true
  }
}

function ChatHeader() {
  Emitter.call(this)
  this.onSearchDebounced = debounce(::this.onSearch, 200)
  this.room = {}
  this.selected = null
  this.user = null
  this.redraw = this.redraw.bind(this)
  this.redraw()
  this.init()
  this.bind()
}

ChatHeader.prototype = Object.create(Emitter.prototype)

ChatHeader.prototype.init = function () {
  this.classes = classes(this.el)
  this.searchForm = qs('.search-form', this.el)
  this.searchInput = qs('.search', this.el)
  this.isRoomManager = false
  this.editState = {
    renaming: false,
    editingDescription: false
  }
  this.mode = 'chat'
  let intercomButton = qs('div' + window.intercomSettings.widget.activator + ' a', this.el)
  if (conf.customSupportEmailAddress) {
    intercomButton.href = `mailto:${conf.customSupportEmailAddress}`
  }
  else if (window.Intercom) {
    intercomButton.href = `mailto:${window.intercomSettings.app_id}@incoming.intercom.io`
    window.Intercom('reattach_activator');
  }
}

ChatHeader.prototype.bind = function () {
  let self = this
  this.events = events(this.el, this)
  this.events.bind('click .option-delete-room', 'toggleDeleteRoomDialog')
  this.events.bind('click .room-name.editable', 'triggerRoomRename')
  this.events.bind('click .option-rename-cancel', 'stopRoomRename')
  this.events.bind('click .option-rename-ok', 'confirmRoomRename')
  this.events.bind('keyup .room-name', 'onRoomRenameShortcuts')
  this.events.bind('keyup .description', 'setDescription')
  this.events.bind('submit form', 'preventFormSubmission')
  this.events.bind('click .description-edit', 'triggerDescriptionEdit')
  this.events.bind('keyup .search', 'onSearchDebounced')
  this.searchInput.addEventListener('focus', ::this.onFocusSearch)
  this.events.bind('click .mentions-toggler', 'toggleMentions')
  this.events.bind('click .file-browser-toggler', 'toggleSharedFiles')
  this.events.bind('click .user-view-toggler', 'toggleUserProfileOrRoomInfo')
}

ChatHeader.prototype.redraw = function () {
  let vdom = template('chatheader.jade', {
    isOrgEmpty: this.isOrgEmpty,
    room: this.room,
    isRoomManager: this.isRoomManager,
    editState: this.editState,
    mode: this.mode,
    menu: {
      items: menuItems,
      selected: this.selected
    }
  })

  render(this, vdom)
}

ChatHeader.prototype.toggleDeleteRoomDialog = function () {
  this.emit('toggledeleteroomdialog', this.room)
}

ChatHeader.prototype.triggerRoomRename = function () {
  this.editState.renaming = true
  this.redraw()
  let roomNameInput = qs('input.room-name', this.el)
  let roomName = roomNameInput.value
  roomNameInput.focus()
  roomNameInput.setSelectionRange(roomName.length,roomName.length)
}

ChatHeader.prototype.stopRoomRename =  function () {
  this.editState.renaming = false
  this.redraw()
}

ChatHeader.prototype.clearSearch = function () {
  this.searchInput.value = ''
}

ChatHeader.prototype.setRoom = function(room, msgID) {
  this.isOrgEmpty = false
  this.room = room
  this.isRoomManager = this.user && ((this.room.creator && this.user === this.room.creator) || (this.user.role >= constants.roles.ROLE_ADMIN))
  this.editState.renaming = false
  this.mode = msgID ? 'search' : 'chat'
  this.redraw()
}

ChatHeader.prototype.preventFormSubmission = function (e) {
  e.preventDefault()
}

ChatHeader.prototype.channelUpdate = function (room) {
  if (this.room != room) return
  this.editState.editingDescription = false
  this.editState.renaming = false
  this.redraw()
}

ChatHeader.prototype.roomRenameError = function (err) {
  qs('input.room-name', this.el).setCustomValidity(err.details.msg)
  qs('input.submit-rename', this.el).click()
}

ChatHeader.prototype.onRoomRenameShortcuts = function (e) {
  switch(keyname(e.keyCode)) {
    case 'enter':
      this.confirmRoomRename()
    case 'esc':
      this.stopRoomRename()
    default:
      e.target.setCustomValidity('')
  }
}

ChatHeader.prototype.confirmRoomRename = function () {
  let newRoomName = qs('input.room-name', this.el).value
  this.emit('confirmroomrename', this.room.id, newRoomName)
}

ChatHeader.prototype.toggleUserProfileOrRoomInfo = function () {
  const selected = menuItems.user === this.selected ? null : menuItems.user
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showSidebar', {type: 'userProfileOrRoomInfo'})
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.toggleSharedFiles = function () {
  const selected = menuItems.sharedFiles === this.selected ? null : menuItems.sharedFiles
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showSidebar', {type: 'sharedFiles'})
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.toggleMentions = function () {
  const selected = menuItems.mentions === this.selected ? null : menuItems.mentions
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showSidebar', {type: 'mentions'})
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.showSearch = function () {
  this.emit('hideSidebar')
  this.emit('showSidebar', {type: 'messageSearch'})
  this.selected = 'search'
  this.redraw()
}

ChatHeader.prototype.triggerDescriptionEdit = function () {
  this.editState.editingDescription = true
  this.redraw()
  let inputDescription = qs('input.description', this.el)
  let onBlur = function () {
    this.stopDescriptionEdit()
  }.bind(this)
  // unfortunately our events.bind method has no support or
  // does not work for blur events, so here is a workaround
  inputDescription.removeEventListener('blur', onBlur)
  inputDescription.focus()
  inputDescription.addEventListener('blur', onBlur)
}

ChatHeader.prototype.stopDescriptionEdit = function () {
  this.editState.editingDescription = false
  this.redraw()
}

ChatHeader.prototype.setDescription = function (e) {
  if (keyname(e.keyCode) !== 'enter') return
  this.emit('setDescription', this.room, e.target.value)
}

ChatHeader.prototype.onSetUser = function(user) {
  this.user = user
  this.redraw()
}

ChatHeader.prototype.onSwitchToChatMode = function () {
  this.mode = 'chat'
  this.redraw()
}

ChatHeader.prototype.onSwitchToSearchMode = function () {
  this.mode = 'search'
  this.redraw()
}

ChatHeader.prototype.onFocusSearch = function () {
  this.showSearch()
  this.onSearch()
}

ChatHeader.prototype.onSearch = function () {
  const query = this.searchInput.value.trim()
  this.emit('search', {query})
}

ChatHeader.prototype.onEmptyOrg = function() {
  this.isOrgEmpty = true
  this.redraw()
}

ChatHeader.prototype.onHideSidebar = function() {
  this.selected = null
  this.redraw()
}
