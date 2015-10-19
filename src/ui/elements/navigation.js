let Emitter = require('emitter')
let Scrollbars = require('scrollbars')
let template = require('template')
let qs = require('query')
let events = require('events')
let closest = require('closest')
let ItemList = require('./itemlist')
let classes = require('classes')
let render = require('../rendervdom')
let debounce = require('debounce')
let resizable = require('resizable')
let store = require('../store').prefix('navigation')
let clamp = require('clamp')
let page = require('page')

module.exports = Navigation

function Navigation() {
  Emitter.call(this)
  this.init()
  this.bind()
  this.ready = false
}

Navigation.prototype = Object.create(Emitter.prototype)

Navigation.prototype.init = function Navigation_init() {
  let self = this
  this.nav = {}
  this.redraw()
  this.el = this.nav.el

  let roomList = this.roomList = new ItemList({
    template: 'roomlist.jade'
  })
  replace(qs('.rooms', this.el), roomList.el)

  let roomListCollapsed = this.roomListCollapsed = new ItemList({
    template: 'roomlist-collapsed.jade'
  })
  replace(qs('.rooms-collapsed', this.el), roomListCollapsed.el)

  let pmList = this.pmList = new ItemList({
    template: 'pmlist.jade'
  })
  replace(qs('.pms', this.el), pmList.el)

  let pmListCollapsed = this.pmListCollapsed = new ItemList({
    template: 'pmlist-collapsed.jade'
  })
  replace(qs('.pms-collapsed', this.el), pmListCollapsed.el)

  let  navScrollbar = this.navScrollbar = new Scrollbars(qs('.nav-wrap-out', this.el))
  let  navScrollbarCollapsed = this.navScrollbarCollapsed = new Scrollbars(qs('.nav-wrap-out-collapsed', this.el))
  let headerCollapsed = false

  document.addEventListener("DOMContentLoaded", function(event) {
    qs('.nav-wrap-out.scrollbars-override', this.el).onscroll = function() { self.handleScrolling() }

    self.collapsedMode = store.get('sidebarCollapsedMode')

    let sidebarWidth = store.get('sidebarWidth')
    if (sidebarWidth == null) sidebarWidth = "240"

    qs('.client-body').style.marginLeft = sidebarWidth + 'px'
    self.el.style.width = sidebarWidth + 'px'

    if (self.collapsedMode && self.collapsedMode == true) {
      classes(document.body).remove("nav-style-basic")
      classes(document.body).add("nav-style-collapsed")

      classes(qs('.nav-collapsed')).add('auto-expand')
    } else {
      classes(document.body).add("nav-style-basic")
      classes(document.body).remove("nav-style-collapsed")
    }

    let navResizable = new resizable(self.el, { directions: ['east'] })

    let resizeClient = function resizeClient() {
      qs('.client-body').style.marginLeft = self.el.clientWidth + 'px'
      store.set('sidebarWidth', self.el.clientWidth)
    }.bind(self)

    // the `orgReady` event is fired on reconnection as well
    // so we need to unbind the resizable and the window
    navResizable.element.removeEventListener('resize', resizeClient)
    window.removeEventListener('resize', resizeClient)

    // listening to the event fired by the resizable component
    navResizable.element.addEventListener('resize', resizeClient)
    window.addEventListener('resize', resizeClient)

    // Initialize all the stuff that will be transitioned in handleScrolling
    self.orgAreaBG = qs('.org-area-bg')
    self.orgAreaBGOverlay = qs('.bg-overlay')
    self.orgInfo = qs('.org-info')
    self.orgLogoName = qs('.org-logo-name img')
    self.orgName = qs('.org-name')
    self.orgTagline = qs('.org-tagline')

    $clamp(self.orgName, {clamp: 2})
    self.clampedSingleLine = false
    })
}

function replace(from, to) {
  from.parentNode.replaceChild(to, from)
}

function animate(element, style, unit, from, to, time) {
    if (!element) return

    let start = new Date().getTime(),
        timer = setInterval(function() {
            let step = Math.min(1,(new Date().getTime() - start) / time)
            element.style[style] = (from + step * (to - from)) + unit
            if (step == 1) clearInterval(timer)
        }, 25)

    element.style[style] = from + unit
}

Navigation.prototype.bind = function Navigation_bind() {
  let self = this
  this.events = events(this.el, {
    triggerRoomCreation: function (ev) {
      self.emit('triggerRoomCreation', closest(ev.target, 'div', true))
    },
    triggerRoomManager: function(ev) {
      if (self.ready) self.emit('triggerRoomManager')
    },
    triggerPMManager: function(ev) {
      if (self.ready) self.emit('triggerPMManager')
    },
    minimizeSidebar: function(ev) {
      store.set('sidebarWidth', self.el.clientWidth)
      classes(document.body).remove("nav-style-basic")
      classes(document.body).add("nav-style-collapsed")

      qs('.nav-collapsed').onmouseleave = function () {
        classes(qs('.nav-collapsed')).add('auto-expand')
        this.onmouseleave = null
      }

      self.collapsedMode = true
      store.set('sidebarCollapsedMode', true)
    },
    expandSidebar: function(ev) {
      let oldWidth = store.get('sidebarWidth') + 'px'

      classes(document.body).add("nav-style-basic")
      classes(document.body).remove("nav-style-collapsed")

      classes(qs('.nav-collapsed')).remove('auto-expand')
      qs('.nav-collapsed').onmouseleave = null

      self.collapsedMode = false
      store.set('sidebarCollapsedMode', false)
    }
  })
  this.events.bind('click .create-room', 'triggerRoomCreation')
  this.events.bind('click .manage-rooms-button', 'triggerRoomManager')
  this.events.bind('click .manage-rooms-button-collapsed', 'triggerRoomManager')
  this.events.bind('click .addpm', 'triggerPMManager')
  this.events.bind('click .minimize-sidebar', 'minimizeSidebar')
  this.events.bind('click .expand-sidebar', 'expandSidebar')
  let closeNavPopovers = debounce(function() {
    this.emit('closeNavPopovers')
  }.bind(this), 500)
  this.navScrollbar.elem.addEventListener('scroll', closeNavPopovers)
  this.navScrollbarCollapsed.elem.addEventListener('scroll', closeNavPopovers)
}

Navigation.prototype.handleScrolling = function Navigation_handleScrolling() {
  let scrollTop = qs('.nav-wrap-out.scrollbars-override', this.el).scrollTop
  let newHeight = Math.max(64, 150 - scrollTop)
  let scaleFactor = ((100 / 86) * (newHeight - 64)) / 100

  if (newHeight < 150 && !this.headerCollapsed) {
    classes(this.orgAreaBG).add("collapse-header-height")
    classes(this.orgAreaBGOverlay).add("collapse-header-height")
    classes(this.orgInfo).add("collapse-header-height")

    classes(this.orgLogoName).add("collapse-logo")
    classes(this.orgName).add("collapse-name")
    this.orgName.style.opacity = "0"

    this.headerCollapsed = true

    setTimeout(function() {
      let orgName = qs('.org-name')
      orgName.style.textAlign = "left"
      $clamp(orgName, {clamp: 1})

      orgName.style.opacity = "1"
    }, 225)
  } else if (newHeight == 150 && this.headerCollapsed) {
    classes(this.orgAreaBG).remove("collapse-header-height")
    classes(this.orgAreaBGOverlay).remove("collapse-header-height")
    classes(this.orgInfo).remove("collapse-header-height")

    classes(this.orgLogoName).remove("collapse-logo")
    classes(this.orgName).remove("collapse-name")
    this.orgName.style.opacity = "0"

    this.headerCollapsed = false

    setTimeout(function() {
      let orgName = qs('.org-name')

      orgName.innerHTML = ui.org.name
      orgName.style.textAlign = "center"
      $clamp(orgName, {clamp: 2})

      orgName.style.opacity = "1"
    }, 150)
  }
}

Navigation.prototype.setLists = function Navigation_setLists(lists) {
  lists.pms.sort(this.pmCompare)
  this.pmList.setItems(lists.pms)
  this.pmListCollapsed.setItems(lists.pms)

  lists.rooms.sort(this.roomCompare)
  this.roomList.setItems(lists.rooms)
  this.roomListCollapsed.setItems(lists.rooms)
}

Navigation.prototype.pmCompare = function Navigation_pmCompare(a, b) {

  function getStatusValue(user) {
    if (!user.active) return 0
    if (user.status == 16) return 3
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

Navigation.prototype.roomCompare = function Navigation_roomCompare(a, b) {
  return b.latest_message_time - a.latest_message_time
}

Navigation.prototype.select = function Navigation_select(item) {
  this.room = item
  this.roomList.selectItem(null)
  this.roomListCollapsed.selectItem(null)
  this.pmList.selectItem(null)
  this.pmListCollapsed.selectItem(null)
  if (item.type === 'pm') {
    let pm = item.users[0]
    let isInList = this.pmList.items.indexOf(pm) > -1 ? true : false
    if (!isInList) this.pmList.items.unshift(pm)
  }
  this[item.type + 'List'].selectItem(item)
  this[item.type + 'ListCollapsed'].selectItem(item)
}

Navigation.prototype.redraw = function Navigation_redraw() {
  render(this.nav, template('navigation.jade'))
  if (this.pmList) this.pmList.redraw()
  if (this.pmListCollapsed) this.pmListCollapsed.redraw()
  if (this.roomList) this.roomList.redraw()
  if (this.roomListCollapsed) this.roomListCollapsed.redraw()
}

Navigation.prototype.onNewMessage = function Navigation_onNewMessage(line) {
  let list = line.channel.type === 'pm' ? this.pmList : this.roomList
  let collapsedList = list == this.pmList ? this.pmListCollapsed : this.roomListCollapsed
  let item = line.channel.type === 'pm' ? line.channel.users[0] : line.channel
  let itemIndex = list.items.indexOf(item)
  if (itemIndex == -1) return

  list.items.splice(itemIndex, 1)
  list.items.unshift(item)
  list.redraw()
  collapsedList.redraw()
}

Navigation.prototype.deleteRoom = function Navigation_deleteRoom (room) {
  let newRoomIndex = this.roomList.items.indexOf(room)
  if (newRoomIndex == -1) return
  this.roomList.items.splice(newRoomIndex, 1)
  this.roomList.redraw()
  this.roomListCollapsed.redraw()
  if (this.room === room) page.replace('/chat/')
}

Navigation.prototype.onChannelRead = function Navigation_onChannelRead () {
  this.redraw()
}

Navigation.prototype.onChannelUpdate = function Navigation_onChannelUpdate () {
  this.roomList.redraw()
  this.roomListCollapsed.redraw()
}

Navigation.prototype.onChangeUser = function Navigation_onChangeUser (user) {
  if (user == ui.user) return
  let pmList = this.pmList
  if (pmList.items.indexOf(user) == -1) pmList.items.push(user)
  pmList.redraw()
  this.pmListCollapsed.redraw()
}

Navigation.prototype.onJoinedChannel = function Navigation_onJoinedChannel (room) {
  let joinedRoomIndex = this.roomList.items.indexOf(room)
  if (joinedRoomIndex > -1) return
  this.roomList.items.push(room)
  this.roomList.redraw()
  this.roomListCollapsed.redraw()
}

Navigation.prototype.onLeftChannel = function Navigation_onLeftChannel (room) {
  let newRoomIndex = this.roomList.items.indexOf(room)
  this.roomList.items.splice(newRoomIndex, 1)
  this.roomList.redraw()
  this.roomListCollapsed.redraw()
}

Navigation.prototype.onUserMention = function Navigation_onUserMention () {
  this.roomList.redraw()
  this.roomListCollapsed.redraw()
}

Navigation.prototype.onOrgReady = function Navigation_onOrgReady(org) {
  let rooms = org.rooms.slice()
  let pms = org.users.filter(function(user) {
    return user != ui.user && user.active && !user.is_only_invited
  })
  this.setLists({ rooms: rooms, pms: pms })

  // we need this redraw for the organization logo
  // cause that is part of the navigation too
  this.redraw()
  this.ready = true
}

