let Emitter = require('emitter')
let render = require('../rendervdom')
let raf = require('raf')
let template = require('template')
let debounce = require('debounce')
let Scrollbars = require('scrollbars')
let qs = require('query')
let classes = require('classes')
let closest = require('closest')
let events = require('events')
let zoom = require('image-zoom')
let focus = require('../focus')
let InfiniteScroll = require('../infinite-scroll')

template.locals.tz = require('moment-timezone')

module.exports = HistoryView

// TODO set firstMsgTime for thr very first message in a room
function HistoryView() {
    Emitter.call(this)
    this.mode = 'chat'; // can be either "search" or "chat"
    this.redraw = this.redraw.bind(this)
    this.queueDraw = this.queueDraw.bind(this)
    this.room = {history: new Emitter([])}
    this.lastwindow = {lastmsg: null, sH: 0}
    this.init()
    this.bind()
    this.scroll = new InfiniteScroll(this.scrollWindow, this._scrolled.bind(this), 0)
    this.scrollMode = 'automatic'
    this.on('needhistory', function () { this.room.loading = true })
    this.unsentBuffer = {}
    this.requestedMsgID = null
    this.isFirstMsgLoaded = false
    this.isLastMsgLoaded = false
}

HistoryView.prototype = Object.create(Emitter.prototype)

HistoryView.prototype.init = function HistoryView_init() {
    let el = this.scrollWindow = document.createElement('div')
    el.className = 'chat'
    this.history = {}
    this.typing = {}
    this.redraw()
    el.appendChild(this.history.el)
    this.redrawTyping()
    el.appendChild(this.typing.el)
    // and make it work with custom scrollbars
    document.createElement('div').appendChild(el)
    let scr = new Scrollbars(el)
    this.el = scr.wrapper
}

HistoryView.prototype.bind = function HistoryView_bind() {
    this.events = events(this.el, this)
    this.events.bind('click .show-invite', 'toggleRoomInvite')
    this.events.bind('click i.btn-delete', 'deleteMessage')
    this.events.bind('click i.btn-edit', 'selectForEditing')
    this.events.bind('click i.btn-delete-from-buffer', 'removeFromBuffer')
    this.events.bind('click a.show-more', 'expandActivityList')
    this.events.bind('click a.show-less', 'collapseActivityList')
    this.events.bind('click div.resend', 'resend')
    this.events.bind('click div.load-newer-history', 'loadNewHistory')
    this.events.bind('click div.load-older-history', 'loadOldHistory')
    this.events.bind('click div.load-newest-history', 'loadNewestHistory')
    let debouncedUpdateRead = debounce(this.updateRead.bind(this), 1500)
    focus.on('focus', debouncedUpdateRead)
    this.scrollWindow.addEventListener('scroll', function () {
        this.scrollMode = 'manual'
    }.bind(this))
}

HistoryView.prototype.onOrgReady = function HistoryView_onOrgReady (org) {
    if (Object.keys(this.unsentBuffer) != 0) return
    org.rooms.forEach( function (room) {
        this.unsentBuffer[room.id] = []
    }.bind(this))
    org.pms.forEach( function (pm) {
        this.unsentBuffer[pm.id] = []
    }.bind(this))
}

HistoryView.prototype.toggleRoomInvite = function () {
    this.emit('toggleRoomInvite', this.room)
}

HistoryView.prototype.deleteMessage = function HistoryView_deleteMessage(ev) {
    let el = closest(ev.target, '.message', true)
    classes(el).add('removing')
    if (confirm("Delete the selected Message?")) {
        let id = el.getAttribute('data-id')
        this.emit('deleteMessage', this.room, id)
    }
    classes(el).remove('removing')
}

HistoryView.prototype.removeFromBuffer = function HistoryView_removeFromBuffer (ev) {
    let msgClientSideID = closest(ev.target, '.message', true).getAttribute('data-id')
    let bufferedMsg = this.findBufferedMsg(msgClientSideID)
    if (!bufferedMsg) return
    let roomUnsentMsgs = this.unsentBuffer[this.room.id]
    roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1)
    this.queueDraw()
}

HistoryView.prototype.loadNewHistory = function HistoryView_loadNewHistory () {
    let options = {
        time_from   : this.room.searchHistory[this.room.searchHistory.length - 1].time,
        sort        : 'time:asc',
        limit       : 5
    }
    this.emit('loadHistoryForSearch', 'new', this.room, options)
}

HistoryView.prototype.loadNewestHistory = function HistoryView_loadNewestHistory () {
    this.emit('switchToChatMode', this.room)
}

HistoryView.prototype.loadOldHistory = function HistoryView_loadOldHistory () {
    let options = {
        time_to : this.room.searchHistory[0].time,
        limit   : 5
    }
    this.emit('loadHistoryForSearch', 'old', this.room, options)
}

HistoryView.prototype.selectForEditing = function HistoryView_selectForEditing(ev) {
    let el = closest(ev.target, '.message', true)
    classes(el).add('editing')

    if (el.parentNode.childNodes[0] === el) {
        let avatar = qs('.avatar', el.parentNode.parentNode.parentNode)
        classes(avatar).add('editing')
    }

    let msg = this.room.history.find("id=='" + el.getAttribute('data-id') + "'")
    this.emit('selectedforediting', msg, this.room)
}

HistoryView.prototype.unselectForEditing = function () {
    let msg = qs(".message.editing", this.el)
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
    let previousLine

    for (let i = 0; i < history.length; i++) {
        let line            = history[i]
        let author          = line.author
        let isService       = author.type === 'service'
        let isTimeSpanShort = last && last.time.getTime() + TIME_THRESHOLD > line.time.getTime()
        let hasSameTitle    = last && line.title && line.title == last.title && !line.objects
        let hasSameMsg      = last && last.message && line.message && last.message == line.message
        let hasSameAuthor   = last && last.author.id == author.id
        let afterAttachment = last && last.attachments && last.attachments.length != 0
        let hasAttachments  = line.attachments && line.attachments.length != 0
        let isGroupable     = isTimeSpanShort && hasSameAuthor && !hasAttachments && !afterAttachment

        // Message is groupable, nice and easy
        if (isGroupable) {
            if (isService && ( hasSameTitle || hasSameMsg )) {
                group.pop()
                counter++
                line.times = counter.toString() // convert to string cause jade gets crazy with numbers
            } else if (isService) {
                groups.push(group = [])
                counter = 1
            }
        } else {
            groups.push(group = [])
            counter = 1
        }

        group.push(last = line)
    }

    return groups
}

HistoryView.prototype.redraw = function HistoryView_redraw() {
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
    } else {
        history = this.room.searchHistory.slice()
        requestedMsg = history.filter( function (msg) {
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
        isLastMsgLoaded: this.isLastMsgLoaded
    }))

    if (this.lastwindow.lastmsg !== this.room.history[0])
        this.scrollWindow.scrollTop += this.scrollWindow.scrollHeight - this.lastwindow.sH

    this.lastwindow = { lastmsg: this.room.history[0], sH: this.scrollWindow.scrollHeight }

    if (this.scrollMode === 'automatic') {
        if (this.mode === 'chat') return this.scrollToBottom()
        let prevMsgEl = qs("div.message[data-id='" + prevMsgID + "']", this.el)
        let requestedMsgEl = qs("div.message[data-id='" + requestedMsg.id + "']", this.el)
        let scrollTarget = prevMsgEl ? prevMsgEl : requestedMsgEl
        scrollTarget.scrollIntoView()
    }
}

HistoryView.prototype.scrollToBottom = function() {
    this.scrollWindow.scrollTop = this.scrollWindow.scrollHeight
}

HistoryView.prototype.updateRead = function HistoryView_updateRead () {
    // we get scroll events even when the window is not focused
    if (focus.state !== 'focus') return
    let bottomElem = this._findBottomVisible()
    if (!bottomElem) return
    let lineID = bottomElem.getAttribute('data-id')
    this.emit('hasread', this.room, lineID)
    this.queueDraw()
}

HistoryView.prototype.queueDraw = function HistoryView_queueDraw() {
    if (this.queued) return
    this.queued = true
    raf(this.redraw)
}

HistoryView.prototype._scrolled = function HistoryView__scrolled(direction, done) {
    if (this.mode === 'search') return
    if (direction === 'bottom') {
        this.scrollMode = 'automatic'
        let debouncedUpdateRead = debounce(this.updateRead.bind(this), 1500)
        debouncedUpdateRead()
        return done()
    } else {
        if (!this.room.empty) done()
    }
    let oldestLine = this.room.history[0]
    let options = {time_to: oldestLine && oldestLine.time || new Date()}
    this.emit('needhistory', this.room, options)
}

HistoryView.prototype.firstMsgLoaded = function HistoryView_firstMsgLoaded (history) {
    let firstLoadedMsg = history[0]
    if (firstLoadedMsg && new Date(firstLoadedMsg.time).getTime() === this.room.first_message_time)
        return true
    return false
}

HistoryView.prototype.lastMsgLoaded = function HistoryView_lastMsgLoaded (history) {
    let lastLoadedMsg = history[history.length - 1]
    if (lastLoadedMsg && new Date(lastLoadedMsg.time).getTime() === this.room.latest_message_time)
        return true
    return false
}

HistoryView.prototype.onGotHistory = function HistoryView_onGotHistory (direction) {
    this.room.loading = false
    this.room.empty = false
    let displayedHistory = this.mode === 'chat' ? this.room.history : this.room.searchHistory
    this.isFirstMsgLoaded = this.firstMsgLoaded(displayedHistory)
    this.isLastMsgLoaded = this.lastMsgLoaded(displayedHistory)
    this.queueDraw()
}

HistoryView.prototype.noHistory = function HistoryView_noHistory() {
    this.room.empty = true
    this.room.loading = false
    this.isFirstMsgLoaded = false
    this.isLastMsgLoaded = false
    this.queueDraw()
}

HistoryView.prototype._findBottomVisible = function HistoryView__findBottomVisible() {
    let history = this.history.el
    let scrollWindow = this.scrollWindow
    let scrollBottom = scrollWindow.offsetTop + scrollWindow.scrollTop + scrollWindow.clientHeight
    for (let i = history.children.length - 1; i >= 0; i--) {
        let child = history.children[i]
        let childBottom = child.offsetTop + child.offsetHeight
        if (childBottom <= scrollBottom) return child
    }
}

HistoryView.prototype.setRoom = function HistoryView_setRoom(room, msgID) {
    let self = this
    this.requestedMsgID = null
    if (this.room) this.room.history.off('remove')
    this.room = room
    // reset, otherwise we won't get future events
    this.scroll.reset()
    this.scrollMode = 'automatic'
    if (!msgID) {
        if (this.room.empty === undefined) {
            this.emit('needhistory', room)
        } else {
            this.isFirstMsgLoaded = this.firstMsgLoaded(room.history)
            this.isLastMsgLoaded = this.lastMsgLoaded(room.history)
        }
        this.mode = 'chat'
        this.queueDraw()
    } else {
        this.emit('requestMessage', room, msgID)
        this.room.loading = true
    }
    this.redrawTyping()
    room.history.on('remove', function (msg, idx) {
        // find removed element and highlight it....
        // then redraw after timeout
        let el = qs("div.message[data-id='" + msg.id + "']", self.el)
        //let avatar = qs(".avatar", el.parentNode.parentNode.parentNode)
        classes(el).add('removed')
        //classes(avatar).add('removed')
        setTimeout(function () {
            // vdom seems to bug a bit so remove the class manually
            // otherwise queueDraw() should be enough
            classes(el).remove('removed')
            //classes(avatar).remove('removed')
            self.queueDraw()
        }, 1000)
    })
    room.off('change typing')
    room.on('change typing', function() {
        self.redrawTyping()
    })
}

HistoryView.prototype.redrawTyping = function HistoryView_redrawTyping() {
    render(this.typing, template('typingnotifications.jade', {
        room: this.room,
        mode: this.mode
    }))
}

HistoryView.prototype.expandActivityList = function HistoryView_expandActivityList (ev) {
    let el = closest(ev.target, 'ul', true)
    classes(el).remove('list-previewed')
}

HistoryView.prototype.collapseActivityList = function HistoryView_collapseActivityList (ev) {
    let el = closest(ev.target, 'ul', true)
    classes(el).add('list-previewed')
}

HistoryView.prototype.onInput = function HistoryView_onInput (room, msg, options) {
    if (this.mode === 'search') this.emit('switchToChatMode', room)
    let attachments = options && options.attachments ? options.attachments : []
    let newMessage = {
        clientSideID: (Math.random() + 1).toString(36).substring(7),
        text: msg,
        status: "pending",
        author: window.ui.user,
        time: new Date(),
        attachments: attachments,
        read: true,
        channel: room
    }
    this.unsentBuffer[room.id].push(newMessage)
    this.scrollMode = 'automatic'
    this.emit('stoptyping', room)
    this.queueDraw()
    this.handlePendingMsg(newMessage)
}

HistoryView.prototype.findBufferedMsg = function HistoryView_findBufferedMsg (clientSideID) {
    let bufferedMsg = null
    this.unsentBuffer[this.room.id].every(function(message) {
        if (clientSideID == message.clientSideID) {
            bufferedMsg = message
            return false
        }
        return true
    })
    return bufferedMsg
}

HistoryView.prototype.onNewMessage = function HistoryView_onNewMessage (line) {
    if (line.channel != this.room || this.mode === 'search') return
    if (line.author == window.ui.user) {
        let bufferedMsg = this.findBufferedMsg(line.clientside_id)
        let roomUnsentMsgs = this.unsentBuffer[line.channel.id]
        if (bufferedMsg) roomUnsentMsgs.splice(roomUnsentMsgs.indexOf(bufferedMsg), 1)
    }
    this.queueDraw()
}

HistoryView.prototype.onNewPMOpened = function HistoryView_onNewPMOpened (pm) {
    // on new pms opened by the visitor
    this.unsentBuffer[pm.id] = []
}

HistoryView.prototype.onNewRoom = function HistoryView_onNewRoon (channel) {
    // on new public rooms
    // new private rooms the visitor get invited to
    // new pms opened by the pm partner
    this.unsentBuffer[channel.id] = []
}

HistoryView.prototype.onChangeUser = function HistoryView_onChangeUser (channel, changed) {
    if (changed && changed.indexOf('title') != -1) {
        this.queueDraw()
    }
    // TODO: also handle first_name, last_name changes
}

HistoryView.prototype.onFocusMessage = function HistoryView_onFocusMessage (msgID) {
    this.mode = 'search'
    this.emit('switchToSearchMode')
    // reset, otherwise we won't get future events
    this.scroll.reset()
    this.requestedMsgID = msgID
    this.room.loading = false
    this.isFirstMsgLoaded = this.firstMsgLoaded(this.room.searchHistory)
    this.isLastMsgLoaded = this.lastMsgLoaded(this.room.searchHistory)
    this.redrawTyping()
    this.queueDraw()
}

HistoryView.prototype.resend = function HistoryView_resend (e) {
    let clientSideID = e.target.getAttribute('data-id')
    let bufferedMsg = this.findBufferedMsg(clientSideID)
    if (!bufferedMsg) return
    bufferedMsg.status = "pending"
    this.queueDraw()
    this.handlePendingMsg(bufferedMsg)
}

HistoryView.prototype.handlePendingMsg = function HistoryView_handlePendingMsg (msg) {
    let options = {
        clientside_id: msg.clientSideID,
        attachments: msg.attachments
    }
    this.emit('send', msg.channel, msg.text, options)

    setTimeout(function() {
        if (this.unsentBuffer[msg.channel.id].indexOf(msg) > -1) {
            msg.status = "unsent"
            this.queueDraw()
        }
    }.bind(this), 5000)
}

HistoryView.prototype.onUploading = function HistoryView_onUploading () {
    if (this.mode === 'chat') return
    this.emit('switchToChatMode', this.room)
}

HistoryView.prototype.onInputResize = function HistoryView_onInputResize () {
    if (this.scrollMode === 'automatic') this.scrollToBottom()
}
