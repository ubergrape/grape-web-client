import page from 'page'

import * as types from '../constants/actionTypes'
import {isMentioned, formatMessage} from './utils'
import omit from 'lodash/object/omit'
import reduxEmitter from '../redux-emitter'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'
import {addUserToChannel} from './channelInfo'
import * as api from '../backend/api'
import {channelSelector, userSelector} from '../selectors'
import store from '../app/store'

export function setChannels(channels) {
  return {
    type: types.SET_CHANNELS,
    payload: channels
  }
}

export function setUsers(users) {
  return {
    type: types.SET_USERS,
    payload: users
  }
}

export function setRooms(rooms) {
  return {
    type: types.SET_ROOMS,
    payload: rooms
  }
}

export function setPMs(pms) {
  return {
    type: types.SET_PMS,
    payload: pms
  }
}

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org
    }
  }
}

export function setInitialData(org) {
  return dispatch => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))
    dispatch(setRooms([...org.rooms]))
    dispatch(setPMs([...org.pms]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))

    return dispatch({
      type: types.INITIAL_DATA_WAS_SET
    })
  }
}

export function setUser(user) {
  return {
    type: types.SET_USER,
    payload: {
      user
    }
  }
}

export function setChannel(channel) {
  return {
    type: types.SET_CHANNEL,
    payload: {
      channel
    }
  }
}

export function setSettings(settings) {
  return {
    type: types.SET_SETTINGS,
    payload: {
      settings
    }
  }
}

export function setSidebarIsLoading(isLoading) {
  return {
    type: types.SET_SIDEBAR_IS_LOADING,
    payload: {
      isLoading
    }
  }
}

export function handleNewMessage(message) {
  return dispatch => {
    const fMessage = formatMessage(message)
    if (fMessage.attachments.length) {
      dispatch(addSharedFiles(fMessage))
    }
    if (isMentioned(fMessage)) {
      dispatch(addMention(fMessage))
    }

    dispatch({
      type: types.HANDLE_NEW_MESSAGE,
      payload: {
        message: fMessage
      }
    })
  }
}

export function handleRemovedMessage({id}) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.HANDLE_REMOVED_MESSAGE,
      payload: {
        messageId: id
      }
    })
  }
}

export function handleReadChannel(data) {
  const user = userSelector(store.getState())
  return {
    type: types.READ_CHANNEL,
    payload: {
      isCurrentUser: user.id === data.user,
      channelId: data.channel
    }
  }
}

export function goToMessage(message) {
  page(`/chat/${message.slug}/${message.id}`)
  return {
    type: types.GO_TO_MESSAGE,
    payload: {
      message
    }
  }
}

export function goToPayment() {
  location.pathname = '/payment'
  return {
    type: types.GO_TO_PAYMENT
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  page(`/chat/${slug}`)
  return {
    type: types.GO_TO_CHANNEL,
    payload: {
      slug
    }
  }
}

export function kickMemberFromChannel(params) {
  reduxEmitter.kickMemberFromChannel(params)
  return {
    type: types.KICK_MEMBER_FROM_CHANNEL
  }
}

export function showOrgInvite() {
  reduxEmitter.showOrgInvite()
  return {
    type: types.SHOW_ORG_INVITE
  }
}

export function handleJoinedChannel({user: userId, channel: channelId}) {
  const user = userSelector(store.getState())
  return dispatch => {
    dispatch(addUserToChannel(userId, channelId))
    dispatch({
      type: types.USER_JOINED_CHANNEL,
      payload: {
        channelId,
        isCurrentUser: userId === user.id
      }
    })
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  const user = userSelector(store.getState())
  return {
    type: types.USER_LEFT_CHANNEL,
    payload: {
      channelId,
      userId,
      isCurrentUser: user.id === userId
    }
  }
}

export function enableNotifications() {
  reduxEmitter.enableNotifications()
  // This action don't have reducer yet
  return {
    type: types.ENABLE_NOTIFICATIONS
  }
}

export function error(err) {
  reduxEmitter.showError(err)
  // This action don't have reducer yet
  return {
    type: types.ERROR,
    payload: error
  }
}

export function invitedToChannel(usernames, channelId) {
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      usernames,
      channelId
    }
  }
}

// This action isn't used yet, remove this comment after first use
/**
 * Run api request to join channel
 * response is handled at app/subscribe.js with action handleJoinedChannel
 */
export function joinChannel({id} = channelSelector(store.getState())) {
  return dispatch => {
    return api
      .joinChannel(id)
      .catch(err => dispatch(error(err)))
  }
}

// This action isn't used yet, remove this comment after first use
export function inviteToChannel(
  usernames,
  {id} = channelSelector(store.getState())
) {
  return dispatch => {
    return api
      .inviteToChannel(usernames, id)
      .then(() => dispatch(invitedToChannel(usernames, id)))
      .catch(err => dispatch(error(err)))
  }
}

export function showChannelsManager() {
  reduxEmitter.showChannelsManager()
  return {
    type: types.SHOW_CHANNELS_MANAGER
  }
}

export function showPMsManager() {
  reduxEmitter.showPMsManager()
  return {
    type: types.SHOW_PMS_MANAGER
  }
}
