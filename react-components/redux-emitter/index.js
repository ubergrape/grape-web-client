import Emitter from 'emitter'

import {toCamel} from '../backend/convertCase'
import boundActions from '../app/boundActions'

function formatChannel(channel) {
  const jsonChannel = channel.toJSON()
  jsonChannel.users = jsonChannel.users.toArray().map(user => toCamel(user.toJSON()))
  if (channel.creator) {
    jsonChannel.creator = toCamel(channel.creator.toJSON())
  }
  return toCamel(jsonChannel)
}

class ReduxEmitter extends Emitter {
  onOrgReady(org) {
    let jsonOrg = org.toJSON()
    jsonOrg.users = org.users.toArray().map(user => toCamel(user.toJSON()))
    jsonOrg.rooms = org.rooms.toArray().map(room => toCamel(room.toJSON()))
    jsonOrg = toCamel(jsonOrg)
    boundActions.setOrg(jsonOrg)
    boundActions.setUsers(jsonOrg.users)
    boundActions.setChannels(jsonOrg.channels)
  }

  onSetUser(user) {
    boundActions.setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel) {
    boundActions.setChannel(formatChannel(channel))
  }

  onSetSettings(settings) {
    boundActions.setSettings(toCamel(settings))
  }

  showRoomManager() {
    this.emit('triggerRoomManager')
  }

  onShowChannelInfo() {
    boundActions.showChannelInfoOrUserProfile()
  }

  leaveChannel(channelId) {
    this.emit('leaveRoom', channelId)
  }

  kickMemberFromChannel(params) {
    this.emit('kickMember', params)
  }

  onUserLeftChannel(channel) {
    boundActions.userLeftChannel(formatChannel(channel))
  }

  inviteChannelMember(channel) {
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

  onHideSidebar() {
    boundActions.hideSharedFiles()
    boundActions.hideUserProfile()
    boundActions.hideChannelInfo()
    boundActions.hideMessageSearch()
    boundActions.hideMentions()
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

  alert(level, type, closeAfter) {
    boundActions.showAlert(...arguments)
  }

  enableNotifications() {
    this.emit('enableNotifications')
  }
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
