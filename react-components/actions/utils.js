import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'

import store from '../app/store'
import {orgSelector, usersSelector, userSelector, channelsSelector} from '../selectors'

export function formatMessage(message) {
  return {...message, time: new Date(message.time)}
}

export function formatSidebarMessage(message) {
  const {
    id,
    author,
    time,
    plainText: content,
    channel: channelId
  } = formatMessage(message)
  const state = store.getState()
  const {channels} = orgSelector(state)
  const currentChannel = find(channels, channel => channel.id === channelId)
  const users = usersSelector(state)
  const {displayName, avatar} = find(users, user => user.id === author.id)

  return {
    id,
    avatar,
    time,
    content,
    // There is no channel name in pm, use the other user name.
    channel: currentChannel.name || currentChannel.users[0].displayName,
    author: displayName,
    // There is no slug in pm, user the other user slug.
    slug: currentChannel.slug || currentChannel.users[0].slug
  }
}

/**
 * Find out if mentions match user id when user mention
 * or when channel mention - matches one of the channel user has joined.
 */
export function isMentioned(message) {
  const {mentions} = message
  if (isEmpty(mentions)) return false

  const state = store.getState()
  const user = userSelector(state)

  if (mentions.user) {
    const mentioned = mentions.user.some(userId => userId === user.id)
    if (mentioned) return true
  }

  if (mentions.room) {
    const channels = channelsSelector(state)
    const joinedChannels = channels.filter(channel => channel.joined)
    const joinedChannelIds = pluck(joinedChannels, 'id')
    const mentioned = intersection(mentions.room, joinedChannelIds).length > 0
    if (mentioned) return true
  }

  return false
}
