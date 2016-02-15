import Emitter from 'emitter'

import {toCamel} from '../backend/convertCase'
import boundActions from '../app/boundActions'
import * as alerts from '../constants/alerts'

class ReduxEmitter extends Emitter {
  onOrgReady(org) {
    // TODO: use raw data from api
    // instead of mutated by old code at src/api
    boundActions.setInitialData(toCamel(org.toJSON()))
  }

  onSetUser(user) {
    boundActions.setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel) {
    boundActions.setChannel(toCamel(channel.toJSON()))
  }

  onSetSettings(settings) {
    boundActions.setSettings(toCamel(settings))
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

  showOrgInvite() {
    this.emit('toggleOrgInvite')
  }

  showRoomInvite() {
    boundActions.showChannelMembersInvite()
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

  showAlert(settings) {
    boundActions.showAlert(settings)
  }

  hideAlert(type) {
    boundActions.hideAlertByType(type)
  }

  enableNotifications() {
    this.emit('enableNotifications')
  }

  setLoadingHistory(value) {
    if (value) {
      boundActions.showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000
      })
      return
    }
    boundActions.hideAlertByType(alerts.LOADING_HISTORY)
  }

  showChannelsManager() {
    this.emit('triggerRoomManager')
  }

  showPMsManager() {
    this.emit('triggerPMManager')
  }

}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
