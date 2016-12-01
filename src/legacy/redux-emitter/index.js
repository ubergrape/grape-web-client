import Emitter from 'emitter'

import {toCamel} from '../../utils/backend/convertCase'
import getBoundActions from '../../app/boundActions'
import * as alerts from '../../constants/alerts'

class ReduxEmitter extends Emitter {
  onOrgReady(org) {
    // TODO: use raw data from api
    // instead of mutated by old code at src/api
    getBoundActions().setInitialData(toCamel(org.toJSON()))
  }

  onSetUser(user) {
    getBoundActions().setUser(toCamel(user.toJSON()))
  }

  onSelectChannel(channel, messageId) {
    getBoundActions().setChannel(toCamel(channel.toJSON()), messageId)
  }

  onSetSettings(settings) {
    getBoundActions().setSettings(toCamel(settings))
  }

  onNewPMOpened(pm) {
    getBoundActions().createChannel(toCamel(pm))
  }

  onEditPreviousMessage() {
    getBoundActions().editPreviousMessage()
  }

  leaveChannel(channelId) {
    this.emit('leaveRoom', channelId)
  }

  showRoomDeteteDialog() {
    this.emit('toggledeleteroomdialog', window.ui.room)
  }

  kickMemberFromChannel(params) {
    this.emit('kickMember', params)
  }

  editMessage(msg) {
    this.emit('editMessage', msg)
  }

  createMessage({id}, text, options) {
    getBoundActions().createMessage({channelId: id, text, ...options})
  }

  onShowSharedFiles() {
    getBoundActions().showSharedFiles()
  }

  onShowMentions() {
    getBoundActions().showMentions()
  }

  onShowMessageSearch() {
    getBoundActions().showMessageSearch()
  }

  onSearchMessages({query}) {
    getBoundActions().updateMessageSearchQuery(query)
  }

  onHideSidebar() {
    getBoundActions().hideSharedFiles()
    getBoundActions().hideUserProfile()
    getBoundActions().hideChannelInfo()
    getBoundActions().hideMessageSearch()
    getBoundActions().hideMentions()
  }

  showInviteToOrg() {
    getBoundActions().showInviteToOrg()
  }

  showRoomInvite() {
    getBoundActions().showChannelMembersInvite()
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
    getBoundActions().showAlert(settings)
  }

  hideAlert(type) {
    getBoundActions().hideAlertByType(type)
  }

  showToastNotification(message, options) {
    getBoundActions().showToastNotification(message, options)
  }

  enableNotifications() {
    this.emit('enableNotifications')
  }

  setLoadingHistory(value) {
    if (value) {
      getBoundActions().showAlert({
        level: 'info',
        type: alerts.LOADING_HISTORY,
        delay: 1000
      })
      return
    }
    getBoundActions().hideAlertByType(alerts.LOADING_HISTORY)
  }

  showChannelsManager() {
    this.emit('triggerRoomManager')
  }

  toggleOrgSettings(elem) {
    this.emit('toggleOrgSettings', elem)
  }

  focusGrapeInput() {
    this.emit('focusGrapeInput')
  }

  showNewConversationAdvanced() {
    getBoundActions().showNewConversationAdvanced()
  }

  showIntro() {
    this.emit('showIntro')
  }
}

const reduxEmitter = new ReduxEmitter()
export default reduxEmitter
