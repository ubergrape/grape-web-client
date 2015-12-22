import Emitter from 'emitter'
import template from 'template'
import qs from 'query'
import events from 'events'
import classes from 'classes'
import keyname from 'keyname'
import debounce from 'lodash/function/debounce'
import each from 'lodash/collection/each'

import conf from 'conf'
import render from '../rendervdom'

module.exports = ChatHeader

const menuItems = {
  user: {
    className: 'user-view-toggler',
    icon: 'fa-info-circle'
  },
  mentions: {
    className: 'mentions-toggler',
    feature: 'mentions_browser',
    icon: 'fa-at'
  },
  sharedFiles: {
    className: 'file-browser-toggler',
    icon: 'fa-files-o',
    feature: 'shared_files_browser'
  },
  intercom: {
    className: 'intercom-toggler',
    icon: 'fa-question-circle'
  }
}

function ChatHeader() {
  Emitter.call(this)
  this.onSearchDebounced = debounce(::this.onSearch, 200)
  this.menuItems = null
  this.room = {}
  this.selected = null
  this.user = null
  this.isRoomManager = false
  this.editState = {
    renaming: false,
    editingDescription: false
  }
  this.initialized = false
  this.mode = 'chat'
  this.redraw()
}

ChatHeader.prototype = Object.create(Emitter.prototype)

ChatHeader.prototype.init = function () {
  if (this.initialized) return
  this.initialized = true
  this.classes = classes(this.el)
  this.searchForm = qs('.search-form', this.el)
  this.searchInput = qs('.search', this.el)
  let intercomButton = qs(`.${this.menuItems.intercom.className} a`, this.el)
  if (conf.customSupportEmailAddress) {
    intercomButton.href = `mailto:${conf.customSupportEmailAddress}`
  } else if (window.Intercom) {
    intercomButton.href = `mailto:${window.intercomSettings.app_id}@incoming.intercom.io`
    window.Intercom('hide')
    window.Intercom('onHide', () => {
      if (this.menuItems.intercom === this.selected) this.toggleIntercom()
    })
    this.on('hideSidebar', () => window.Intercom('hide'))
  }
  this.bindEvents()
}

ChatHeader.prototype.bindEvents = function () {
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
  this.events.bind('click .intercom-toggler', 'toggleIntercom')
}

ChatHeader.prototype.redraw = function () {
  let vdom = template('chatheader.jade', {
    isOrgEmpty: this.isOrgEmpty,
    room: this.room,
    isRoomManager: this.isRoomManager,
    editState: this.editState,
    mode: this.mode,
    menu: {
      items: this.menuItems,
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
  this.isRoomManager = this.user && ((this.room.creator && this.user === this.room.creator) || (this.user.role >= conf.constants.roles.ROLE_ADMIN))
  this.editState.renaming = false
  this.mode = msgID ? 'search' : 'chat'
  this.redraw()
  this.updateUserProfileOrRoomInfo()
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

ChatHeader.prototype.roomRenameError = function ChatHeader_roomRenameError(err) {
  qs('input.room-name', this.el).setCustomValidity(err.message)
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
  const selected = this.menuItems.user === this.selected ? null : this.menuItems.user
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showChannelInfo')
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.updateUserProfileOrRoomInfo = function () {
  const selected = this.menuItems.user === this.selected
  if (!selected) return
  this.emit('hideSidebar')
  this.emit('showChannelInfo')
  this.selected = this.menuItems.user
  this.redraw()
}

ChatHeader.prototype.toggleSharedFiles = function () {
  const selected = this.menuItems.sharedFiles === this.selected ? null : this.menuItems.sharedFiles
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showSharedFiles')
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.toggleMentions = function () {
  const selected = this.menuItems.mentions === this.selected ? null : this.menuItems.mentions
  if (this.selected) this.emit('hideSidebar')
  if (selected) this.emit('showMentions')
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.toggleIntercom = function (e) {
  if (!window.Intercom) return
  if (e) e.preventDefault()
  const selected = this.menuItems.intercom === this.selected ? null : this.menuItems.intercom
  if (this.selected) this.emit('hideSidebar')
  if (selected) window.Intercom('show')
  this.selected = selected
  this.redraw()
}

ChatHeader.prototype.showSearch = function () {
  if (this.selected === 'search') return
  this.emit('hideSidebar')
  this.emit('showMessageSearch')
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

ChatHeader.prototype.onSetUser = function (user) {
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

ChatHeader.prototype.onEmptyOrg = function () {
  this.isOrgEmpty = true
  this.redraw()
}

ChatHeader.prototype.onOrgReady = function (org) {
  this.menuItems = {}
  each(menuItems, (item, name) => {
    const enabled = org.features[item.feature] == null || org.features[item.feature] === true
    if (enabled) this.menuItems[name] = item
  })
  this.redraw()
  this.init()
}

ChatHeader.prototype.onHideSidebar = function() {
  this.selected = null
  this.redraw()
}
