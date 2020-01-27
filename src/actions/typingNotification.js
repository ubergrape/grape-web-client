import { each } from 'lodash'

import * as types from '../constants/actionTypes'

/**
 * This cleanup function can be periodically called to remove expired
 * typing users.
 * Currently the TypingNotification component invokes this action every 1000ms.
 */
export const cleanupTyping = channels => dispatch => {
  const updatedChannels = {}
  let isModified = false

  each(channels, (users, channelId) => {
    const typingUsers = users.filter(user => user.expires > Date.now())
    if (channels[channelId].length !== typingUsers.length) isModified = true
    if (typingUsers.length) updatedChannels[channelId] = typingUsers
  })

  if (!isModified) return

  dispatch({
    type: types.SET_TYPING_USERS,
    payload: updatedChannels,
  })
}
