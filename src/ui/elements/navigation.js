let Emitter = require('emitter')
let template = require('template')
let qs = require('query')
let events = require('events')
let closest = require('closest')
let ItemList = require('../utils/itemlist')
let render = require('../rendervdom')
let debounce = require('debounce')
let resizable = require('resizable')
let store = require('../store').prefix('navigation')
let page = require('page')

module.exports = Navigation

function Navigation() {
  Emitter.call(this)
  this.init()
  this.bind()
  this.ready = false
}

Navigation.prototype = Object.create(Emitter.prototype)

Navigation.prototype.init = function () {
  let self = this
  this.nav = {}
  this.redraw()
  this.el = this.nav.el

  let roomList = this.roomList = new ItemList({
    template: 'roomlist.jade'
  })
  replace(qs('.rooms', this.el), roomList.el)

  let pmList = this.pmList = new ItemList({
    template: 'pmlist.jade'
  })
  replace(qs('.pms', this.el), pmList.el)
}

function replace(from, to) {
  from.parentNode.replaceChild(to, from)
}

Navigation.prototype.bind = function () {
  let self = this
  this.events = events(this.el, {
    triggerRoomCreation: function (ev) {
      self.emit('triggerRoomCreation', closest(ev.target, 'div', true))
    },
    triggerRoomManager: function (ev) {
      if (self.ready) self.emit('triggerRoomManager')
    },
    triggerPMManager: function (ev) {
      if (self.ready) self.emit('triggerPMManager')
    }
  })
  this.events.bind('click .create-room', 'triggerRoomCreation')
  this.events.bind('click .manage-rooms-button', 'triggerRoomManager')
  this.events.bind('click .addpm', 'triggerPMManager')
}

Navigation.prototype.setLists = function Navigation_setLists(lists) {
  lists.pms.sort(this.pmCompare)
  this.pmList.setItems(lists.pms)
  lists.rooms.sort(this.roomCompare)
  this.roomList.setItems(lists.rooms)
}

Navigation.prototype.pmCompare = function (a, b) {

  function getStatusValue(user) {
    if (!user.active) return 0
    if (user.status === 16) return 3
    if (user.is_only_invited) return 1
    return 2
  }

  let aLastMessage = a.pm && a.active ? a.pm.latest_message_time : 0
  let bLastMessage = b.pm && b.active ? b.pm.latest_message_time : 0

  if (bLastMessage - aLastMessage != 0)
    return bLastMessage - aLastMessage
  else
    return getStatusValue(b) - getStatusValue(a)
}


Navigation.prototype.getWeekAgo = function() {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  return weekAgo
}

Navigation.prototype.setProactiveItem = function (weekAgo = this.getWeekAgo(), item) {
  const prop = 'latest_message_time'
  const last = item.type === 'room' ? item[prop] : item.pm[prop]
  item.proactive = weekAgo - last < 0
  return item
}

Navigation.prototype.setProactiveList = function (list) {
  const weekAgo = this.getWeekAgo()
  list.forEach(this.setProactiveItem.bind(this, weekAgo))
  return list
}

Navigation.prototype.roomCompare = function (a, b) {
  return b.latest_message_time - a.latest_message_time
}

Navigation.prototype.select = function (item) {
  this.room = item
  if (item.type == 'pm') {
    this.roomList.selectItem(null)
    this.pmList.selectItem(item)
  }
  else {
    this.pmList.selectItem(null)
    this.roomList.selectItem(item)
  }
}

Navigation.prototype.redraw = function () {
  render(this.nav, template('navigation.jade'))

  const {roomList, pmList} = this
  if (roomList) {
    let {items} = roomList
    if (items) items = this.setProactiveList(items)
    roomList.redraw()
  }

  if (pmList) {
    let {items} = pmList
    if (items) items = this.setProactiveList(items)
    pmList.redraw()
  }
}

Navigation.prototype.onNewMessage = function (line) {
  let list = line.channel.type === 'pm' ? this.pmList : this.roomList
  let item = line.channel.type === 'pm' ? line.channel.users[0] : line.channel
  let itemIndex = list.items.indexOf(item)
  if (itemIndex === -1) return

  list.items.splice(itemIndex, 1)
  list.items.unshift(item)
  list.redraw()
}

Navigation.prototype.deleteRoom = function (room) {
  let newRoomIndex = this.roomList.items.indexOf(room)
  if (newRoomIndex === -1) return
  this.roomList.items.splice(newRoomIndex, 1)
  this.roomList.redraw()
  if (this.room === room) page.replace('/chat/')
}

Navigation.prototype.onChannelRead = function () {
  this.redraw()
}

Navigation.prototype.onChannelUpdate = function () {
  this.roomList.redraw()
}

Navigation.prototype.onChangeUser = function (user) {
  if (user === window.ui.user) return
  if (this.pmList.items.indexOf(user) === -1) this.pmList.items.push(user)
  this.nav.user = user
  this.redraw()
}

Navigation.prototype.onJoinedChannel = function (room) {
  let joinedRoomIndex = this.roomList.items.indexOf(room)
  if (joinedRoomIndex > -1) return
  this.roomList.items.push(room)
  this.roomList.redraw()
}

Navigation.prototype.onLeftChannel = function (room) {
  let newRoomIndex = this.roomList.items.indexOf(room)
  this.roomList.items.splice(newRoomIndex, 1)
  this.roomList.redraw()
}

Navigation.prototype.onUserMention = function () {
  this.roomList.redraw()
}

Navigation.prototype.onChannelRead = function Navigation_onChannelRead () {
  this.redraw()
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate () {
  this.roomList.redraw()
}

Navigation.prototype.onDeletedUser = function() {
  this.pmList.redraw()
  this.pmListCollapsed.redraw()
}

Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
  const rooms = org.rooms.slice().filter(room => room.joined)
  const pms = org.users.filter(user => {
    return user != window.ui.user && user.active && !user.is_only_invited
  })

  this.setLists({
    rooms: this.setProactiveList(rooms),
    pms: this.setProactiveList(pms)
  })
  this.nav.user = window.ui.user

  // we need this redraw for the organization logo
  // cause that is part of the navigation too
  this.redraw()
  this.ready = true
}
