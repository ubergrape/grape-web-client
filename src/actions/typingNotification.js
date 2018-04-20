import each from 'lodash/collection/each'
import find from 'lodash/collection/find'

import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {error} from './'

const typingLifetime = 5000

export function handleTypingNotification({user, users, org, channel, typingNotification}, data) {
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
        typingUser = find(users, _user => _user.partner.id === data.user)
        if (typingUser) {
          const {id, partner: {displayName}} = typingUser
          channels[data.channel].push({id, name: displayName, expires})
        } else {
          // Need to fetch a user if it's not in get_overview list from initial loading
          api
            .getUser(org.id, data.user)
            .then(({pm, displayName}) => {
              channels[data.channel].push({id: pm, name: displayName, expires})
            })
            .catch((err) => {
              dispatch(error(err))
            })
        }
      }
    // We received an explicite "stop typing".
    // Remove this user from typing list.
    } else {
      channels[data.channel] = channels[data.channel].filter(_user => _user.id !== data.user)
    }

    // Remove expired events. This is important to avoid duplicates rendering to
    // `Felix and Felix is typing`. The TypingNotification component currently invokes
    // the action cleanupTyping, but this can be out of sync and therefor filtering is
    // quick fix that works for now.
    channels[data.channel] = channels[data.channel]
      .filter(({expires}) => expires > Date.now())

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
 * Currently the TypingNotification component invokes this action every 1000ms.
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
