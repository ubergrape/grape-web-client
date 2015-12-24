import page from 'page'

import store from '../app/store'
import {channelSelector} from '../selectors'
import * as types from '../constants/actionTypes'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'
import {addUserToChannel} from './channelInfo'
import {isMentioned, formatMessage} from './utils'
import reduxEmitter from '../redux-emitter'

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

export function channelLoadingHistory(value) {
  return {
    type: types.CHANNEL_LOADING_HISTORY,
    payload: value
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

export function userLeftChannel(channel) {
  return dispatch => {
    const currentChannel = channelSelector(store.getState())

    if (currentChannel && currentChannel.id === channel.id) {
      dispatch({
        type: types.USER_LEFT_CURRENT_CHANNEL,
        payload: {
          channel
        }
      })
    }

    dispatch({
      type: types.USER_LEFT_CHANNEL,
      payload: {
        channel
      }
    })
  }
}

export function inviteChannelMember(channel) {
  reduxEmitter.inviteChannelMember(channel)
  return {
    type: types.INVITE_CHANNEL_MEMBER
  }
}

export function handleJoinedChannel({user, channel}) {
  return dispatch => {
    dispatch(addUserToChannel(user, channel))
    dispatch({
      type: types.HANDLE_JOINED_CHANNEL,
      payload: {
        channelId: channel,
        userId: user
      }
    })
  }
}

export function enableNotifications() {
  reduxEmitter.enableNotifications()
  // This action don't have reducer yet
  return {
    type: types.ENABLE_NOTIFICATIONS
  }
}
