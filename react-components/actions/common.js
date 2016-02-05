import page from 'page'

import * as types from '../constants/actionTypes'
import {isMentioned, formatMessage} from './utils'
import reduxEmitter from '../redux-emitter'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'
import {addUserToChannel} from './channelInfo'
import * as api from '../backend/api'
import {channelSelector} from '../selectors'
import store from '../app/store'
import {type as connection} from '../backend/client'

export function setUsers(users) {
  return {
    type: types.SET_USERS,
    payload: {
      users
    }
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

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org
    }
  }
}

export function setChannels(channels) {
  return {
    type: types.SET_CHANNELS,
    payload: {
      channels
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
  return {
    type: types.READ_CHANNEL,
    payload: {
      userId: data.user,
      channelId: data.channel
    }
  }
}

export function goToMessage(message) {
  return dispatch => {
    dispatch({
      type: types.GO_TO_MESSAGE,
      payload: {
        message
      }
    })
    page(`/chat/${message.slug}/${message.id}`)
  }
}

export function goToPayment() {
  return dispatch => {
    dispatch({
      type: types.GO_TO_PAYMENT
    })
    location.pathname = '/payment'
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  return dispatch => {
    dispatch({
      type: types.GO_TO_CHANNEL,
      payload: {
        slug
      }
    })
    page(`/chat/${slug}`)
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
  return dispatch => {
    dispatch(addUserToChannel(userId, channelId))
    dispatch({
      type: types.USER_JOINED_CHANNEL,
      payload: {
        channelId,
        userId
      }
    })
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  return {
    type: types.USER_LEFT_CHANNEL,
    payload: {
      channelId,
      userId
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

export function joinedChannel(channelId) {
  return {
    type: types.JOINED_CHANNEL,
    payload: channelId
  }
}

// This action isn't used yet, remove this comment after first use
export function joinChannel({id} = channelSelector(store.getState())) {
  return dispatch => {
    return api
      .joinChannel(id)
      .then(() => dispatch(joinedChannel(id)))
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

export function reloadOnAuthError() {
  return dispatch => {
    dispatch({
      type: types.AUTH_ERROR
    })
    location.reload()
  }
}

export function handleConnectionError(err) {
  return dispatch => {
    dispatch({
      type: types.CONNECTION_ERROR,
      payload: err
    })

    if (connection === 'ws') {
      api
        .checkAuth()
        .catch(_err => {
          if (_err.status === 401) dispatch(reloadOnAuthError())
        })
      return
    }

    if (connection === 'lp' && err.status === 401) {
      dispatch(reloadOnAuthError())
    }
  }
}
