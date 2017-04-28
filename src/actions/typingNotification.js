import each from 'lodash/collection/each'
import find from 'lodash/collection/find'

import * as types from '../constants/actionTypes'

const typingLifetime = 5000

export function handleTypingNotification({user, users, channel, typingNotification}, data) {
  return (dispatch) => {
    // Its a notification from myself.
    // We call that action directly from subscription sometimes.
    if (data.user === user.id) return

    const channels = {...typingNotification.channels}
    if (!channels[data.channel]) channels[data.channel] = []
    if (data.typing) {
      const expires = Date.now() + typingLifetime
      let typingUser = find(channels[data.channel], _user => _user.id === data.user)
      // Just bump exiration date.
      if (typingUser) typingUser.expires = expires
      else {
        typingUser = find(users, _user => _user.id === data.user)
        channels[data.channel].push({
          id: typingUser.id,
          name: typingUser.displayName,
          expires
        })
      }
    // We received an explicite "stop typing".
    // Remove this user from typing list.
    } else {
      channels[data.channel] = channels[data.channel].filter(_user => _user.id !== data.user)
    }

    dispatch({
      type: types.SET_TYPING_USERS,
      payload: channels
    })
  }
}

/**
 * We don't rely on stop typing event.
 * This cleanup function can be periodically called to remove expired
 * typing users.
 */
export function cleanupTyping(channels) {
  return (dispatch) => {
    const now = Date.now()
    let isModified = false

    each(channels, (users, channelId) => {
      const typingUsers = users.filter(user => user.expires > now)
      if (channels[channelId].length !== typingUsers.length) isModified = true
      // TODO: This modifies the origin parameter and current consumers seems to depend on it!
      channels[channelId] = typingUsers // eslint-disable-line no-param-reassign
    })

    if (!isModified) return

    dispatch({
      type: types.SET_TYPING_USERS,
      payload: {...channels}
    })
  }
}
