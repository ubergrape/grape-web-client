import array from 'array'
import Emitter from 'component-emitter'
import noop from 'lodash/utility/noop'

import conf from '../../conf'
import models from './models'
import rpc from '../../utils/backend/rpc'
import client from '../../utils/backend/client'
import * as convertCase from '../../utils/backend/convertCase'

const exports = module.exports = API
exports.models = models

function API() {
  Emitter.call(this)
  // the currently signed in user
  this.user = undefined
  // user settings
  this.settings = undefined
  // list of all the organizations the user belongs to
  this.organizations = undefined
  // the currently active organization
  this.organization = undefined
  // A channel for incomming events.
  this.in = new Emitter()
  this.subscribe()
}

API.prototype = Object.create(Emitter.prototype)

API.prototype.connect = function API_connect() {
  const channel = client().connect()
  // TODO We might want to differentiate here and log some errors to sentry.
  channel.on('error', console.error.bind(console))
  channel.on('connected', () => {
    // Resync the whole data if we got a new client id, because we might have
    // missed some messages. This is related to the current serverside arch.
    channel.once('set:id', () => {
      this.sync()
    })
  })
  channel.on('disconnected', () => {
    channel.off('set:id')
    this.emit('disconnected')
  })
  channel.on('data', (data) => {
    this.in.emit(data.event, data)
  })
}

API.prototype.sync = function API_sync() {
  rpc({
    ns: 'users',
    action: 'get_profile'
  }, (err, data) => {
    if (err) return this.emit('error', err)
    this.user = new models.User(data)
    this.user.active = true
    this.settings = this.user.settings
    this.organizations = array(data.organizations.map(org => new models.Organization(org)))
    this.emit('changeUser', this.user)
    this.emit('change settings', this.settings)
    this.emit('change organizations', this.organizations)
    this.emit('connected')
  })
}

API.prototype.subscribe = function API_subscribe() {
  const self = this
  // channel events
  this.in.on('channel.new', (data) => {
    self._tryAddRoom(data.channel)
    self.emit('newRoom', data.channel)
  })
  this.in.on('channel.updated', (data) => {
    const room = models.Room.get(data.channel.id)
    room.name = data.channel.name
    room.slug = data.channel.slug
    room.description = data.channel.description
    self.emit('channelupdate', room)
  })
  this.in.on('channel.removed', (data) => {
    const room = models.Room.get(data.channel)
    const index = self.organization.rooms.indexOf(room)
    if (~index) { self.organization.rooms.splice(index, 1) }
    self.emit('roomdeleted', room)
  })
  this.in.on('channel.read', (data) => {
    const user = models.User.get(data.user)
    const line = models.Line.get(data.message)
    if (!line) return // ignore read notifications for messages we don’t have
    const room = line.channel
    // ignore this for the current user, we track somewhere else
    if (user === self.user) {
      room.unread = 0
      room.mentioned = 0
      return self.emit('channelRead')
    }
    const last = room._readingStatus[data.user]
    // remove the user from the last lines readers
    if (last) {
      const i = last.readers.indexOf(user)
      last.readers.splice(i, 1)
    }
    // and add it to the new line
    room._readingStatus[data.user] = line
    line.readers.push(user)
  })
  this.in.on('channel.joined', (data) => {
    const user = models.User.get(data.user)
    const room = models.Room.get(data.channel)
    if (~room.users.indexOf(user)) return
    // if the user joining the room is the visitor,
    // we need to emit the leftChannel event as well
    // to ensure consistent behaviour across clients
    if (user === self.user) {
      room.joined = true
      self.emit('joinedChannel', room)
    }
    room.users.push(user)
    self.emit('newRoomMember', room, user)
  })
  this.in.on('channel.left', (data) => {
    const user = models.User.get(data.user)
    const room = models.Room.get(data.channel)
    const index = room.users.indexOf(user)
    if (!~index) return
    // if the user leaving the room is the visitor,
    // we need to emit the leftChannel event as well
    // to ensure consistent behaviour across clients
    if (user === self.user) {
      room.joined = false
      self.emit('leftChannel', room)
    }
    room.users.splice(index, 1)
    self.emit('memberLeftChannel', room, user)
  })

  // organization events
  this.in.on('organization.joined', (data) => {
    // make sure the user doesnt exist yet in the client
    let user = models.User.get(data.user.id)
    if (!user) user = new models.User(data.user)
    // make sure we're joining the right organization
    // and the user isnt in there yet
    if (data.organization === self.organization.id &&
        !~self.organization.users.indexOf(user)) {
      user.active = true
      user.status = 0
      user.pm = null
      self.organization.users.push(user)
    }
  })
  this.in.on('organization.left', (data) => {
    const user = models.User.get(data.user)
    const index = self.organization.users.indexOf(user)
    if (user && ~index && data.organization === self.organization.id) {
      user.active = false
      self.emit('deletedUser', user)
    }
  })

  // message events
  this.in.on('message.new', (data) => {
    data.read = false
    let line = models.Line.get(data.id)
    const room = models.Room.get(data.channel)
    if (~room.history.indexOf(line)) return
    line = new models.Line(data)
    room.unread++
    room.history.push(line)
    const messageTime = new Date(line.time).getTime()
    room.latest_message_time = messageTime
    room.first_message_time = room.first_message_time ? room.first_message_time : messageTime
    // users message and everything before that is read
    if (line.author === self.user) self.setRead(room, line.id)
    self.emit('newMessage', line)
  })
  this.in.on('message.updated', (data) => {
    const msg = models.Line.get(data.id)
    if (!msg) return
    // right now only text can be updated
    msg.text = data.text
    const ch = models.Room.get(data.channel)
    const idx = ch.history.indexOf(msg)
    if (~idx) ch.history.splice(idx, 1, msg)
  })
  this.in.on('message.removed', (data) => {
    const msg = models.Line.get(data.id)
    const ch = models.Room.get(data.channel)
    const idx = ch.history.indexOf(msg)
    if (~idx) ch.history.splice(idx, 1)
  })

  // user events
  this.in.on('user.status', (data) => {
    const user = models.User.get(data.user)
    user.status = data.status
    self.emit('changeUser', user)
  })
  this.in.on('user.mentioned', (data) => {
    if (data.message.organization !== self.organization.id) return
    let line = models.Line.get(data.message.id)
    if (!line) line = new models.Line(data.message.id)
    line.channel.mentioned++
    self.emit('userMention')
  })
  this.in.on('user.updated', (data) => {
    const user = models.User.get(data.user.id)
    user.username = data.user.username
    user.firstName = data.user.firstName
    user.lastName = data.user.lastName
    user.displayName = data.user.displayName
    user.email = data.user.email
    user.is_only_invited = data.user.is_only_invited
    user.what_i_do = data.user.what_i_do
    user.skype_username = data.user.skype_username
    user.phone_number = data.user.phone_number
    if (data.user.avatar !== null) user.avatar = data.user.avatar
    self.emit('changeUser', user)
  })

  this.in.on('membership.updated', (data) => {
    const user = models.User.get(data.membership.user)
    const changed = []
    if (user.role !== data.membership.role) {
      changed.push('role')
      user.role = data.membership.role
    }
    if (user.title !== data.membership.title) {
      changed.push('title')
      user.title = data.membership.title
    }
    self.emit('changeUser', user, changed)
  })
}

const unknownUser = {
  username: 'unknown',
  firstName: 'unknown',
  lastName: 'User'
}

API.prototype._newRoom = function API__newRoom(room) {
  room.users = room.users.map(u =>
    // if the user was not in the models array for some reason
    // create an unknown user so the room loads correctly
     models.User.get(u) || new models.User(unknownUser))
  const selfindex = room.users.indexOf(this.user)
  room.joined = !!~selfindex
  // the user MUST NOT be the first in the list
  if (selfindex === 0) { room.users.push(room.users.shift()) }
  room = new models.Room(room)

  // defaults
  if (typeof room.unread === 'undefined') {
    room.unread = 0
  }

  return room
}

API.prototype._tryAddRoom = function API__tryAddRoom(room) {
  const gotroom = models.Room.get(room.id)
  if (gotroom) return gotroom
  room = this._newRoom(room)
  if (room.type === 'room') {
    this.organization.rooms.push(room)
  } else {
    this.organization.pms.push(room)
  }
  // TODO: this should maybe be handled in the pm model
  if (room.type === 'pm') {
    room.users[0].pm = room
  }
  return room
}

/**
 * This sets the current active organization. It also joins it and loads the
 * organization details such as the users and rooms.
 */
API.prototype.setOrganization = function API_setOrganization(_org, callback) {
  if (!_org) return
  callback || (callback = noop)
  const self = this
  // TODO: this should also leave any old organization
  // first get the details
  rpc({
    ns: 'organizations',
    action: 'get_organization',
    args: [_org.id]
  }, (err, res) => {
    if (err) return self.emit('error', err)
    const org = new models.Organization(res)
    if (org.role == null) org.role = _org.role
    org.users = res.users.map((u) => {
      const user = models.User.get(u.id) || new models.User(u)
      user.status = u.status
      return user
    })

    const rooms = res.channels.map(self._newRoom.bind(self))
    org.rooms = rooms.filter(r => r.type === 'room')
    org.pms = rooms.filter(r => r.type === 'pm')
    if (res.logo !== null) org.logo = res.logo
    if (res.custom_emojis !== null) org.custom_emojis = res.custom_emojis
    if (res.has_integrations !== null) org.has_integrations = res.has_integrations

    org.inviter_role = res.inviter_role
    // connect users and pms
    org.pms.forEach((pm) => { pm.users[0].pm = pm })

    // then join
    rpc({
      ns: 'organizations',
      action: 'join',
      clientId: client().id,
      args: [org.id]
    }, (err) => {
      if (err) return self.emit('error', err)
      self.organization = org
      // put role and title in user object for consistency with other user objects
      self.user.role = org.role
      self.user.title = org.title
      self.emit('change organization', org)
      this.emit('changeUser', this.user)
      callback()
    })
  })
}

API.prototype.getRoomIcons = function API_getRoomIcons(org, callback) {
  callback || (callback = noop)
  rpc({
    ns: 'organizations',
    action: 'list_icons',
    args: [org.id]
  }, (err, res) => {
    if (err) return this.emit('error', err)
    callback()
  })
}

API.prototype.changedTimezone = function API_changedTimezone(tz) {
  rpc({
    ns: 'users',
    action: 'set_profile',
    args: [{timezone: tz}]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onEditView = function API_onEditView(status) {
  rpc({
    ns: 'users',
    action: 'set_profile',
    args: [{compact_mode: status}]
  }, (err) => {
    if (err) return this.emit('error', err)
    this.user.settings.compact_mode = status
    this.emit('viewChanged', status)
  })
}

API.prototype.openPM = function API_openPM(user, callback) {
  callback || (callback = noop)
  rpc({
    ns: 'pm',
    action: 'open',
    args: [this.organization.id, user.id]
  }, (err, pm) => {
    if (err) return this.emit('error', err)
    pm = this._newRoom(pm)
    this.organization.pms.push(pm)
    user.pm = pm
    this.emit('newPMOpened', pm)
    callback()
  })
}

API.prototype.joinRoom = function API_joinRoom(room, callback) {
  if (room.joined) return
  callback || (callback = noop)
  rpc({
    ns: 'channels',
    action: 'join',
    args: [room.id]
  }, (err) => {
    if (err) return this.emit('error', err)
    room.joined = true
    callback()
  })
}

API.prototype.onLeaveRoom = function API_onLeaveRoom(roomId) {
  const room = models.Room.get(roomId)
  if (!room.joined) return
  rpc({
    ns: 'channels',
    action: 'leave',
    args: [room.id]
  }, (err) => {
    if (err) return this.emit('error', err)
    room.joined = false
    room.history = []
  })
}

API.prototype.renameRoom = function API_renameRoom(roomId, newName) {
  rpc({
    ns: 'rooms',
    action: 'rename',
    args: [roomId, newName]
  }, (err) => {
    if (err) return this.emit('roomrenameerror', err)
  })
}

API.prototype.autocomplete = function API_autocomplete(text, options = {}, callback) {
  rpc({
    ns: 'search',
    action: 'autocomplete',
    args: [
      text,
      this.organization.id,
      options.showAll || false,
      // Amount of results per section.
      15,
      // Return external services too.
      true
    ]
  }, {camelize: true}, callback)
}

API.prototype.autocompleteDate = function API_autocompleteDate(text, callback) {
  rpc({
    ns: 'search',
    action: 'autocomplete_date',
    args: [text, this.organization.id]
  }, callback)
}

/**
 * Loads history for `room`
 */
API.prototype.getHistory = function API_getHistory(room, options) {
  options = options || {}
  rpc({
    ns: 'channels',
    action: 'get_history',
    args: [room.id, options]
  }, (err, res) => {
    if (err) return this.emit('error', err)
    // so when the first message in history is read, assume the history as read
    // as well
    const read = !!room.history.length && room.history[0].read
    if (res.length === 0) return this.emit('nohistory')
    // append all to the front of the array
    // TODO: for now the results are sorted in reverse order, will this be
    // consistent?
    const lines = res.map((line) => {
      // check if line already exists and only add it to the history
      // if it isnt in the history yet
      const exists = models.Line.get(line.id)
      if (!exists || !~room.history.indexOf(exists)) {
        line.read = read
        line = new models.Line(line)
        // TODO: maybe check if everythings correctly sorted before
        // inserting the line?
        room.history.unshift(line)
      }
    })
    this.emit('gotHistory')
  })
}


API.prototype.setRead = function API_setRead(room, lineId) {
  // update the unread count
  // iterate the history in reverse order
  // (its more likely the read line is at the end)
  const line = models.Line.get(lineId)
  if (!line) return
  room.mentioned = 0
  let setread = false
  for (let i = room.history.length - 1; i >= 0; i--) {
    const l = room.history[i]
    if (l.read) break
    if (l === line) {
      setread = true
      room.unread = room.history.length - i - 1
    }
    if (setread) l.read = true
  }
  if (!setread) return
  // and notify the server
  // TODO: emit error?
  rpc({
    ns: 'channels',
    action: 'read',
    args: [room.id, lineId]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onRequestMessage = function API_onRequestMessage(room, msgId) {
  // channels/focus_message, room ID, msg ID, before, after, strict
  // strict is false by default
  // when false, fallback results will be returned
  // when true, unexisting msg IDs will throw an error
  rpc({
    ns: 'channels',
    action: 'focus_message',
    args: [room.id, msgId, 25, 25, true]
  }, (err, res) => {
    if (err) return this.emit('messageNotFound', room)
    room.searchHistory.splice(0, room.searchHistory.length)
    const lines = res.map((line) => {
      const exists = models.Line.get(line.id)
      if (!exists || !~room.searchHistory.indexOf(exists)) {
        line = new models.Line(line)
        line.read = true
        room.searchHistory.push(line)
      }
    })
    this.emit('focusMessage', msgId)
  })
}

API.prototype.onSetTyping = function({channel, typing}) {
  rpc({
    ns: 'channels',
    action: 'set_typing',
    args: [channel.id, typing]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onDeleteMessage = function API_onDeleteMessage(ch, msgId) {
  rpc({
    ns: 'channels',
    action: 'delete_message',
    args: [ch.id, msgId]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.publish = function API_publish(room, msg, options) {
  msg = msg.text ? msg.text : msg
  rpc({
    ns: 'channels',
    action: 'post',
    args: [room.id, msg, options]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.updateMsg = function API_updateMessage(msg, text) {
  rpc({
    ns: 'channels',
    action: 'update_message',
    args: [msg.channel.id, msg.id, text]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onKickMember = function API_onKickMember({channelId, userId}) {
  rpc({
    ns: 'channels',
    action: 'kick',
    args: [channelId, Number(userId)]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onSetDescription = function(room, description) {
  rpc({
    ns: 'rooms',
    action: 'set_description',
    args: [room.id, description]
  }, (err) => {
    if (err) return this.emit('error', err)
  })
}

API.prototype.onInviteToOrg = function(emails) {
  rpc({
    ns: 'organizations',
    action: 'invite',
    args: [this.organization.id, {emails}]
  }, (err, res) => {
    if (err) return this.emit('inviteError')
    this.emit('inviteSuccess')
  })
}
