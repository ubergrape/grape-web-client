import Emitter from 'emitter'

import {toCamel} from '../backend/convertCase'
import boundActions from '../app/boundActions'

class ReduxEmitter extends Emitter {
  onOrgReady(org) {
    let jsonOrg = org.toJSON()
    jsonOrg.users = jsonOrg.users.map(user => toCamel(user.toJSON()))
    jsonOrg = toCamel(jsonOrg)
    boundActions.setOrg(jsonOrg)
    boundActions.setUsers(jsonOrg.users)
    boundActions.setChannels(jsonOrg.channels)
  }

  onSetUser(user) {
    boundActions.setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel) {
    boundActions.setChannel(formatChannel(channel))
  }

  onSetSettings(settings) {
    boundActions.setSettings(toCamel(settings))
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }

  onShowUserProfile() {
    boundActions.showUserProfile()
  }

  onShowChannelInfo() {
    boundActions.showChannelInfo()
  }

  leaveChannel(channelId) {
    this.emit('leaveRoom', channelId)
  }

  kickMemberFromChannel(params) {
    this.emit('kickMember', params)
  }

  onMemberLeftChannel(channel, user) {
    boundActions.memberLeftChannel(formatChannel(channel))
  }

  inviteChannelMember(channel) {
    this.emit('toggleRoomInvite', channel)
  }

  onShowSharedFiles() {
    boundActions.showSharedFiles()
  }

  onShowMentions() {
    boundActions.showMentions()
  }

  onShowMessageSearch() {
    boundActions.showMessageSearch()
  }

  onSearchMessages({query}) {
    boundActions.updateMessageSearchQuery(query)
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
