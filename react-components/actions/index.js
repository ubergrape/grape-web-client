import page from 'page'
import find from 'lodash/collection/find'
import each from 'lodash/collection/each'

import * as types from '../constants/actionTypes'
import reduxEmitter from '../redux-emitter'

import {
  find as findChannel,
  getFileteredItems as getFileteredChannels
} from '../channel-search/utils'

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

export function showChannelSearch(org, user) {
  return {
    type: types.SHOW_CHANNEL_SEARCH,
    payload: {
      show: true,
      items: getFileteredChannels(org, user)
    }
  }
}

export function hideChannelSearch() {
  return {
    type: types.HIDE_CHANNEL_SEARCH,
    payload: {
      show: false,
      search: ''
    }
  }
}

export function inputChannelSearch(search, org, user) {
  return {
    type: types.INPUT_CHANNEL_SEARCH,
    payload: {
      search,
      items: findChannel(getFileteredChannels(org, user), search)
    }
  }
}

export function selectChannelSearch(channel) {
  page('/chat/' + channel.slug)
  return dispatch => dispatch(hideChannelSearch())
}

export function showRoomManager() {
  reduxEmitter.showRoomManager()
  return dispatch => {
    dispatch(hideChannelSearch())
  }
}

export function showBillingWarning() {
  return {
    type: types.SHOW_BILLING_WARNING,
    payload: {
      show: true
    }
  }
}

export function hideBillingWarning() {
  return {
    type: types.HIDE_BILLING_WARNING,
    payload: {
      show: false
    }
  }
}

export function goToPayment() {
  location.pathname = '/payment'
  return {
    type: types.GO_TO_PAYMENT
  }
}

const typingLifetime = 5000

export function setTyping({user, users, channel, typingNotification}, data) {
  // Do nothing, its a notification from myself.
  if (data.user === user.id) {
    return {
      type: types.SET_TYPING_USERS,
      payload: typingNotification
    }
  }

  const channels = {...typingNotification.channels}
  if (!channels[data.channel]) channels[data.channel] = []

  if (data.typing) {
    let typingUser = find(channels[data.channel], user => user.id === data.user)
    // Just bump exiration date.
    if (typingUser) typingUser.expires = Date.now() + typingLifetime
    else {
      typingUser = find(users, user => user.id === data.user)
      channels[data.channel].push({
        id: typingUser.id,
        name: typingUser.displayName,
        expires: Date.now() + typingLifetime
      })
    }
  }
  else {
    channels[data.channel] = channels[data.channel].filter(user => user.id !== data.user)
  }

  return {
    type: types.SET_TYPING_USERS,
    payload: {
      channels,
      channel
    }
  }
}

/**
 * We don't rely on stop typing event.
 * This cleanup function can be periodically called to remove expired
 * typing users.
 */
export function cleanupTyping(channels) {
  const now = Date.now()
  let isModified = false

  each(channels, (users, channelId) => {
    const typingUsers = users.filter(user => user.expires > now)
    if (channels[channelId].length !== typingUsers.length) isModified = true
    channels[channelId] = typingUsers
  })

  return {
    type: types.SET_TYPING_USERS,
    payload: {
      channels: isModified ? {...channels} : channels
    }
  }
}

export function showUserProfile() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_USER_PROFILE,
    payload: {
      show: true
    }
  }
}

export function hideUserProfile() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_USER_PROFILE,
    payload: {
      show: false
    }
  }
}

export function showChannelInfo() {
  reduxEmitter.showSidebar()
  return {
    type: types.SHOW_CHANNEL_INFO,
    payload: {
      show: true
    }
  }
}

export function hideChannelInfo() {
  reduxEmitter.hideSidebar()
  return {
    type: types.HIDE_CHANNEL_INFO,
    payload: {
      show: false
    }
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  page(`/chat/${slug}`)
  return {
    type: types.GO_TO_CHANNEL
  }
}

export function kickMemberFromChannel(params) {
  reduxEmitter.kickMemberFromChannel(params)
  return {
    type: types.KICK_MEMBER_FROM_CHANNEL
  }
}

export function memberLeftChannel(channel) {
  return {
    type: types.MEMBER_LEFT_CHANNEL,
    payload: {
      channel
    }
  }
}

export function inviteChannelMember(channel) {
  reduxEmitter.inviteChannelMember(channel)
  return {
    type: types.INVITE_CHANNEL_MEMBER
  }
}
