import each from 'lodash/collection/each'

import * as types from '../constants/actionTypes'

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
