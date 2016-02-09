import Emitter from 'emitter'
import render from '../rendervdom'
import raf from 'raf'
import template from 'template'
import debounce from 'lodash/function/debounce'
import Scrollbars from 'scrollbars'
import qs from 'query'
import classes from 'classes'
import closest from 'closest'
import events from 'events'
import focus from '../focus'
import InfiniteScroll from '../infinite-scroll'
import find from 'lodash/collection/find'
import reduxEmitter from '../../../react-components/redux-emitter'

template.locals.tz = require('moment-timezone')

module.exports = HistoryView

// TODO set firstMsgTime for thr very first message in a room
function HistoryView() {
  Emitter.call(this)
  this.mode = 'chat' // can be either "search" or "chat"
  this.redraw = this.redraw.bind(this)
  this.queueDraw = this.queueDraw.bind(this)
  this.room = {history: new Emitter([])}
  this.lastwindow = {lastmsg: null, sH: 0}
  this.updateReadDebounced = debounce(::this.updateRead, 1500)
  this.init()
  this.bind()
  this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 0)
  this.scrollMode = 'automatic'
  this.on('needhistory', () => reduxEmitter.setLoadingHistory(true))
  this.unsentBuffer = {}
  this.requestedMsgID = null
  this.isFirstMsgLoaded = false
  this.isLastMsgLoaded = false
  this.isOrgEmpty = false
  // Used to distinguish between user triggered scroll events and programmatic once.
  this.ignoreScroll = false
}

HistoryView.prototype = Object.create(Emitter.prototype)

HistoryView.prototype.init = function() {
  let el = this.scrollWindow = document.createElement('div')
  el.className = 'chat'
  this.history = {}
  this.redraw()
  el.appendChild(this.history.el)
  // and make it work with custom scrollbars
  document.createElement('div').appendChild(el)
  let scr = new Scrollbars(el)
  this.el = scr.wrapper
}

HistoryView.prototype.bind = function() {
  this.events = events(this.el, this)
  this.events.bind('click .show-invite', 'showRoomInvite')
  this.events.bind('click i.btn-delete', 'deleteMessage')
  this.events.bind('click i.btn-edit', 'selectForEditing')
  this.events.bind('click i.btn-delete-from-buffer', 'removeFromBuffer')
  this.events.bind('click a.show-more', 'expandActivityList')
  this.events.bind('click a.show-less', 'collapseActivityList')
  this.events.bind('click div.resend', 'resend')
  this.events.bind('click div.load-newer-history', 'loadNewHistory')
  this.events.bind('click div.load-older-history', 'loadOldHistory')
  this.events.bind('click div.load-newest-history', 'loadNewestHistory')
  this.events.bind('click .org-invite', 'onOrgInvite')
  this.events.bind('click .manage-rooms', 'onManageRooms')
  focus.on('focus', this.updateReadDebounced)
  this.scrollWindow.addEventListener('scroll', (e) => {
    // Scroll mode should be manual only if scroll event has been triggered by
    // the user.
    if (this.ignoreScroll) return
    this.scrollMode = 'manual'
  }.bind(this))
}

HistoryView.prototype.onOrgReady = function(org) {
  if (Object.keys(this.unsentBuffer).length) return
  org.rooms.forEach((room) => {
    this.unsentBuffer[room.id] = []
  }.bind(this))
  org.pms.forEach((pm) => {
    this.unsentBuffer[pm.id] = []
  }.bind(this))
}

HistoryView.prototype.renderTypingNotification = function() {
  if (this.typingNotification) return
  this.typingNotification = document.createElement('grape-typing-notification')
  this.scrollWindow.appendChild(this.typingNotification)
}

HistoryView.prototype.showRoomInvite = function() {
  this.emit('showRoomInvite')
}

HistoryView.prototype.deleteMessage = function(ev) {
  let el = closest(ev.target, '.message', true)
  classes(el).add('removing')
  if (confirm('Delete the selected Message?')) {
    let id = el.getAttribute('data-id')
    this.emit('deleteMessage', this.room, id)
  }
  classes(el).remove('removing')
}

HistoryView.prototype.removeFromBuffer = function(ev) {
  let msgClientSideID = closest(ev.target, '.message', true).getAttribute('data-id')
  let bufferedMsg = this.findBufferedMsg(msgClientSideID)
  if (!bufferedMsg) return
  let roomUnsentMsgs = this.unsentBuffer[this.room.id]
  roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1)
  this.queueDraw()
}

HistoryView.prototype.loadNewHistory = function() {
  let options = {
    time_from: this.room.searchHistory[this.room.searchHistory.length - 1].time,
    sort: 'time:asc',
    limit: 5
  }
  this.emit('loadHistoryForSearch', 'new', this.room, options)
}

HistoryView.prototype.loadNewestHistory = function() {
  this.emit('switchToChatMode', this.room)
}

HistoryView.prototype.loadOldHistory = function() {
  let options = {
    time_to: this.room.searchHistory[0].time,
    limit: 5
  }
  this.emit('loadHistoryForSearch', 'old', this.room, options)
}

HistoryView.prototype.selectForEditing = function(ev) {
  let el = closest(ev.target, '.message', true)
  classes(el).add('editing')

  if (el.parentNode.childNodes[0] === el) {
    let avatar = qs('.avatar', el.parentNode.parentNode.parentNode)
    classes(avatar).add('editing')
  }

  let msg = this.room.history.find("id=='" + el.getAttribute('data-id') + "'")
  this.emit('selectedforediting', msg, this.room)
}

HistoryView.prototype.unselectForEditing = function() {
  let msg = qs('.message.editing', this.el)
  if (msg) {
    classes(msg).add('edited')
    classes(msg).remove('editing')
  }
}

// only group messages that are X seconds apart
let TIME_THRESHOLD = 5 * 60 * 1000

function groupHistory(history) {
  let groups = []
  let counter = 1
  let last
  let group

  for (let i = 0; i < history.length; i++) {
    let line = history[i]
    let author = line.author
    let isService = author.type === 'service'
    let isTimeSpanShort = last && last.time.getTime() + TIME_THRESHOLD > line.time.getTime()
    let hasSameTitle = last && line.title && line.title === last.title && !line.objects
    let hasSameMsg = last && last.message && line.message && last.message === line.message
    let hasSameAuthor = last && last.author.id === author.id
    let afterAttachment = last && last.attachments && last.attachments.length
    let hasAttachments = line.attachments && line.attachments.length
    let isGroupable = isTimeSpanShort && hasSameAuthor && !hasAttachments && !afterAttachment

    // Message is groupable, nice and easy
    if (isGroupable) {
      if (isService && ( hasSameTitle || hasSameMsg )) {
        group.pop()
        counter++
        line.times = counter.toString() // convert to string cause jade gets crazy with numbers
      }
      else if (isService) {
        groups.push(group = [])
        counter = 1
      }
    }
    else {
      groups.push(group = [])
      counter = 1
    }

    group.push(last = line)
  }

  return groups
}

HistoryView.prototype.redraw = function() {
  let history
  let requestedMsg
  let prevMsgID
  this.queued = false

  if (this.mode === 'chat') {
    // update the read messages. Do this before we redraw, so the new message
    // indicator is up to date
    if (this.room.history.length && (!this.lastwindow.lastmsg ||
      (this.scrollMode === 'automatic' && focus.state === 'focus'))) {
      this.emit('hasread', this.room, this.room.history[this.room.history.length - 1].id)
    }
    // create a copy of the history
    history = this.room.history.slice()
    // merge buffered messages with copy of history
    if (this.unsentBuffer) {
      let roomUnsentMsgs = this.unsentBuffer[this.room.id]
      if (roomUnsentMsgs) history = history.concat(roomUnsentMsgs)
    }
  }
  else {
    history = this.room.searchHistory.slice()
    requestedMsg = history.filter((msg) => {
      return msg.id === this.requestedMsgID
    }.bind(this))[0]
    prevMsgID = history.indexOf(requestedMsg) > 0 ? history[history.indexOf(requestedMsg) - 1].id : this.requestedMsgID
  }

  // eventually group history
  let groupedHistory = groupHistory(history)

  render(this.history, template('chathistory.jade', {
    room: this.room,
    history: groupedHistory,
    mode: this.mode,
    requestedMsgID: this.requestedMsgID,
    isFirstMsgLoaded: this.isFirstMsgLoaded,
    isLastMsgLoaded: this.isLastMsgLoaded,
    isOrgEmpty: this.isOrgEmpty
  }))

  if (this.lastwindow.lastmsg !== this.room.history[0]) {
    this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - this.lastwindow.sH
  }

  this.lastwindow = { lastmsg: this.room.history[0], sH: this.scrollWindow.scrollHeight }

  if (this.scrollMode === 'automatic') {
    if (this.mode === 'chat') return this.scrollToBottom()
    let prevMsgEl = qs("div.message[data-id='" + prevMsgID + "']", this.el)
    let requestedMsgEl = qs("div.message[data-id='" + requestedMsg.id + "']", this.el)
    this.scrollIntoView(prevMsgEl ? prevMsgEl : requestedMsgEl)
  }
}

HistoryView.prototype.scrollIntoView = function(target) {
  this.ignoreScroll = true
  target.scrollIntoView()
  setTimeout(() => this.ignoreScroll = false, 300)
}

HistoryView.prototype.scrollToBottom = function() {
  this.ignoreScroll = true
  this.scrollWindow.scrollTop = this.scrollWindow.scrollHeight
  setTimeout(() => this.ignoreScroll = false, 300)
}

HistoryView.prototype.updateRead = function() {
  // we get scroll events even when the window is not focused
  if (focus.state !== 'focus') return
  let bottomElem = this._findBottomVisible()
  if (!bottomElem) return
  let lineID = bottomElem.getAttribute('data-id')
  this.emit('hasread', this.room, lineID)
  this.queueDraw()
}

HistoryView.prototype.queueDraw = function() {
  if (this.queued) return
  this.queued = true
  raf(this.redraw)
}

HistoryView.prototype._scrolled = function(direction, done) {
  if (this.mode === 'search') return
  if (direction === 'bottom') {
    this.scrollMode = 'automatic'
    this.updateReadDebounced()
    return done()
  }
  if (!this.room.empty) done()
  let oldestLine = this.room.history[0]
  let options = {time_to: oldestLine && oldestLine.time || new Date()}
  this.emit('needhistory', this.room, options)
}

HistoryView.prototype.firstMsgLoaded = function(history) {
  let firstLoadedMsg = history[0]
  if (firstLoadedMsg && new Date(firstLoadedMsg.time).getTime() === this.room.first_message_time) {
    return true
  }
  return false
}

HistoryView.prototype.lastMsgLoaded = function(history) {
  let lastLoadedMsg = history[history.length - 1]
  if (lastLoadedMsg && new Date(lastLoadedMsg.time).getTime() === this.room.latest_message_time) {
    return true
  }
  return false
}

HistoryView.prototype.onGotHistory = function() {
  reduxEmitter.setLoadingHistory(false)
  this.room.empty = false
  let displayedHistory = this.mode === 'chat' ? this.room.history : this.room.searchHistory
  this.isFirstMsgLoaded = this.firstMsgLoaded(displayedHistory)
  this.isLastMsgLoaded = this.lastMsgLoaded(displayedHistory)
  this.queueDraw()
}

HistoryView.prototype.noHistory = function() {
  this.room.empty = true
  reduxEmitter.setLoadingHistory(false)
  this.isFirstMsgLoaded = false
  this.isLastMsgLoaded = false
  this.queueDraw()
}

HistoryView.prototype._findBottomVisible = function() {
  let history = this.history.el
  let scrollWindow = this.scrollWindow
  let scrollBottom = scrollWindow.offsetTop + scrollWindow.scrollTop + scrollWindow.clientHeight
  for (let i = history.children.length - 1; i >= 0; i--) {
    let child = history.children[i]
    let childBottom = child.offsetTop + child.offsetHeight
    if (childBottom <= scrollBottom) return child
  }
}

HistoryView.prototype.setRoom = function(room, msgID) {
  let self = this
  this.requestedMsgID = null
  this.isOrgEmpty = false
  if (this.room) this.room.history.off('remove')
  this.room = room
  // render with all loaded before history is too slow
  // https://github.com/ubergrape/chatgrape/issues/3160
  room.history = room.history.slice(-50)

  // reset, otherwise we won't get future events
  this.scroll.reset()
  this.scrollMode = 'automatic'
  if (!msgID) {
    if (this.room.empty === undefined) {
      this.emit('needhistory', room)
    }
    else {
      if (room.empty) room.empty = false
      this.isFirstMsgLoaded = this.firstMsgLoaded(room.history)
      this.isLastMsgLoaded = this.lastMsgLoaded(room.history)
    }
    this.mode = 'chat'
    this.queueDraw()
  }
  else {
    this.emit('requestMessage', room, msgID)
    reduxEmitter.setLoadingHistory(true)
  }
  room.history.on('remove', (msg) => {
    // find removed element and highlight it....
    // then redraw after timeout
    const el = qs("div.message[data-id='" + msg.id + "']", self.el)
    // let avatar = qs(".avatar", el.parentNode.parentNode.parentNode)
    classes(el).add('removed')
    // classes(avatar).add('removed')
    setTimeout(() => {
      // vdom seems to bug a bit so remove the class manually
      // otherwise queueDraw() should be enough
      classes(el).remove('removed')
      // classes(avatar).remove('removed')
      this.queueDraw()
    }, 1000)
  })

  this.renderTypingNotification()
}

HistoryView.prototype.expandActivityList = function(ev) {
  let el = closest(ev.target, 'ul', true)
  classes(el).remove('list-previewed')
}

HistoryView.prototype.collapseActivityList = function(ev) {
  let el = closest(ev.target, 'ul', true)
  classes(el).add('list-previewed')
}

HistoryView.prototype.onInput = function(room, msg, options) {
  if (this.mode === 'search') this.emit('switchToChatMode', room)
  let attachments = options && options.attachments ? options.attachments : []
  let newMessage = {
    clientSideID: (Math.random() + 1).toString(36).substring(7),
    text: msg,
    status: 'pending',
    author: window.ui.user,
    time: new Date(),
    attachments: attachments,
    read: true,
    channel: room
  }
  this.unsentBuffer[room.id].push(newMessage)
  this.scrollMode = 'automatic'
  this.queueDraw()
  this.handlePendingMsg(newMessage)
}

HistoryView.prototype.findBufferedMsg = function(clientSideID) {
  let localUnsent = this.unsentBuffer[this.room.id]
  return find(localUnsent, (msg) => msg.clientSideID === clientSideID)
}

HistoryView.prototype.onNewMessage = function(line) {
  if (line.channel !== this.room || this.mode === 'search') return
  if (line.author === window.ui.user) {
    let bufferedMsg = this.findBufferedMsg(line.clientside_id)
    let roomUnsentMsgs = this.unsentBuffer[line.channel.id]
    if (bufferedMsg) roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1)
  }
  this.queueDraw()
}

HistoryView.prototype.onNewPMOpened = function(pm) {
  // on new pms opened by the visitor
  this.unsentBuffer[pm.id] = []
}

HistoryView.prototype.onNewRoom = function(channel) {
  // on new public rooms
  // new private rooms the visitor get invited to
  // new pms opened by the pm partner
  this.unsentBuffer[channel.id] = []
}

HistoryView.prototype.onChangeUser = function(channel, changed) {
  if (changed && changed.indexOf('title') !== -1) {
    this.queueDraw()
  }
  // TODO: also handle first_name, last_name changes
}

HistoryView.prototype.onFocusMessage = function(msgID) {
  this.mode = 'search'
  this.emit('switchToSearchMode')
  // reset, otherwise we won't get future events
  this.scroll.reset()
  this.requestedMsgID = msgID
  reduxEmitter.setLoadingHistory(false)
  this.isFirstMsgLoaded = this.firstMsgLoaded(this.room.searchHistory)
  this.isLastMsgLoaded = this.lastMsgLoaded(this.room.searchHistory)
  this.queueDraw()
}

HistoryView.prototype.resend = function(e) {
  let clientSideID = e.target.getAttribute('data-id')
  let bufferedMsg = this.findBufferedMsg(clientSideID)
  if (!bufferedMsg) return
  bufferedMsg.status = 'pending'
  this.queueDraw()
  this.handlePendingMsg(bufferedMsg)
}

HistoryView.prototype.handlePendingMsg = function(msg) {
  let options = {
    clientside_id: msg.clientSideID,
    attachments: msg.attachments
  }
  this.emit('send', msg.channel, msg.text, options)

  setTimeout(() => {
    if (this.unsentBuffer[msg.channel.id].indexOf(msg) > -1) {
      msg.status = 'unsent'
      this.queueDraw()
    }
  }.bind(this), 5000)
}

HistoryView.prototype.onOrgInvite = function() {
  this.emit('toggleOrgInvite')
}

HistoryView.prototype.onManageRooms = function() {
  this.emit('triggerRoomManager')
}

HistoryView.prototype.onEmptyOrg = function() {
  this.isOrgEmpty = true
  this.redraw()
}

HistoryView.prototype.onUploading = function() {
  if (this.mode === 'chat') return
  this.emit('switchToChatMode', this.room)
}

HistoryView.prototype.onInputResize = function() {
  if (this.scrollMode === 'automatic') this.scrollToBottom()
}
