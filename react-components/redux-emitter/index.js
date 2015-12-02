import Emitter from 'emitter'

import {toCamel} from '../backend/convertCase'

import {bindActionCreators} from 'redux'
import * as actions from '../actions'

import store from '../app/store'

class ReduxEmitter extends Emitter {
  constructor() {
    super()
    this.actions = bindActionCreators(actions, store.dispatch)
  }

  onOrgReady(org) {
    let jsonOrg = org.toJSON()
    jsonOrg.users = jsonOrg.users.map(user => toCamel(user.toJSON()))
    jsonOrg = toCamel(jsonOrg)
    this.actions.setOrg(jsonOrg)
    this.actions.setUsers(jsonOrg.users)
    this.actions.setChannels(jsonOrg.channels)
  }

  onSetUser(user) {
    this.actions.setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel) {
    this.actions.setChannel(formatChannel(channel))
  }

  onSetSettings(settings) {
    this.actions.setSettings(toCamel(settings))
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }

  onShowUserProfile() {
    this.actions.showUserProfile()
  }

  onShowChannelInfo() {
    this.actions.showChannelInfo()
  }

  leaveChannel(channelId) {
    this.emit('leaveRoom', channelId)
  }

  kickMemberFromChannel(params) {
    this.emit('kickMember', params)
  }

  onMemberLeftChannel(channel, user) {
    this.actions.memberLeftChannel(formatChannel(channel))
  }

  inviteChannelMember(channel) {
    this.emit('toggleRoomInvite', channel)
  }

  onShowSharedFiles() {
    this.actions.showSharedFiles()
  }

  showSidebar() {
    this.emit('showSidebar')
  }

  hideSidebar() {
    this.emit('hideSidebar')
  }

  showError(err) {
    this.emit('error', err)
  }
}

function formatChannel(channel) {
  const jsonChannel = channel.toJSON()
  jsonChannel.users = jsonChannel.users.toArray().map(user => toCamel(user.toJSON()))
  if (channel.creator) {
    jsonChannel.creator = toCamel(channel.creator.toJSON())
  }
  return toCamel(jsonChannel)
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
