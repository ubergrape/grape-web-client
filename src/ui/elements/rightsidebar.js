let Emitter = require('emitter')
let template = require('template')
let render = require('../rendervdom')
let ItemList = require('./itemlist')
let qs = require('query')
let events = require('events')
let classes = require('classes')
let broker = require('broker')
let hexToRgb = require('color-converter')

module.exports = RightSidebar

function RightSidebar() {
  Emitter.call(this)
  this.content = {}
  this.room = new Emitter({name: '', users: []})
  this.user = null
  this.redraw(true)
  this.el = this.content.el
  this.init()
  this.bind()
}

RightSidebar.prototype = Object.create(Emitter.prototype)

RightSidebar.prototype.init = function RightSidebar_init() {
  this.classes = classes(this.el)
  this.canKickMembers = false
  this.visible = false
  this.mode = null
  this.redraw(true)
  this.userProfile = {}

  let membersList = this.membersList = new ItemList({
    template: 'roommembers.jade'
  })
}

RightSidebar.prototype.bind = function RightSidebar_bind() {
  let self = this
  this.events = events(this.el, {
    close: function () {
      self.hide()
    }
  })
  this.events.obj.toggleRoomInvite = function(ev) {
    this.emit('toggleRoomInvite', this.room)
  }.bind(this)
  this.events.obj.deleteRoomMember = function (ev) {
    let roomID = this.room.id
    let memberID = ev.target.getAttribute('data-id')
    this.emit('kickMember', roomID, memberID)
  }.bind(this)
  this.events.bind('click i.btn-delete', 'deleteRoomMember')
  this.events.bind('click .invite-members', 'toggleRoomInvite')
}

function replace(from, to) {
  from.parentNode.replaceChild(to, from)
}

RightSidebar.prototype.renderUserProfile = function () {
  if (!this.user) return
  render(this.userProfile, template('user-profile.jade', {
    user: this.user
  }))
}

RightSidebar.prototype.setListItems = function RightSidebar_setListItems(items) {
  this.membersList.setItems(items)
}

RightSidebar.prototype.select = function RightSidebar_select(item) {
  this.membersList.selectItem(null)
  this[item.type + 'List'].selectItem(item)
}

RightSidebar.prototype.redraw = function RightSidebar_redraw(force) {
  if (!this.visible && !force) return

  let color = {r: 100, g: 50, b: 100}

  if (this.room.color)
    color = hexToRgb(this.room.color.toLowerCase())

  let vdom = template('rightsidebar.jade', {
    room: this.room,
    canKickMembers: this.canKickMembers,
    color: color,
    mode: this.mode
  })
  render(this.content, vdom)
}

/* scroll down in the members list */
RightSidebar.prototype.scrollDown = function RightSidebar_scrollDown() {
  let list = qs('.user-list', this.el)
  let scrollHeight = list.scrollHeight
  list.scrollTop = scrollHeight
}

RightSidebar.prototype.setRoom = function RoomMembers_setRoom(room) {
  this.mode = room.type
  this.redraw(true)
  this.room = room
  if (this.mode == 'room') {
    this.canKickMembers = ui.user === room.creator || ui.user.role >= 1
    this.setListItems({
      room: room,
      canKickMembers: this.canKickMembers
    })
    replace(qs('.right-sidebar-room-wrap', this.el), this.membersList.el)
  } else {
    this.user = room.users[0]
    this.renderUserProfile()
    replace(qs('.right-sidebar-room-wrap', this.el), this.userProfile.el)
  }
  this.redraw(true)
}

RightSidebar.prototype.onMemberLeftChannel = function RightSidebar_onMemberLeftChannel(room) {
  if (room == this.room) this.membersList.redraw()
}

RightSidebar.prototype.onNewRoomMember = function (room) {
  if (room == this.room) this.membersList.redraw()
}

RightSidebar.prototype.onChangeUser = function () {
  if (!this.visible) return
  this.membersList.redraw()
  this.renderUserProfile()
}

RightSidebar.prototype.toggle = function RightSidebar_toggle() {
  this.visible = !this.visible
  this.membersList.redraw()
  this.renderUserProfile()
  let clientBody = qs('.client-body')
  clientBody.classList.toggle('right-sidebar-show')
}
