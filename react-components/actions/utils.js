import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'

import store from '../app/store'
import {
  usersSelector,
  userSelector,
  channelsSelector,
  joinedRoomsSelector
} from '../selectors'

export function pinToFavourite(channel) {
  const {pin} = channel
  const newChannel = {
    ...channel,
    favourited: (pin || pin === 0) ? { order: pin } : null
  }
  delete newChannel.pin
  return newChannel
}

export function reduceChannelUsersToId(channel) {
  return {
    ...channel,
    users: channel.users.map(user => {
      if (user.id) return user.id
      return user
    })
  }
}

export function formatMessage(message) {
  return {
    ...message,
    time: new Date(message.time),
    attachments: message.attachments || []
  }
}

/**
 * Count number of mentions that
 * match user id or joined room id when
 * some user or room is mentioned.
 */
export function countMentions(message) {
  const {mentions} = message
  let count = 0
  if (isEmpty(mentions)) return count

  const state = store.getState()

  if (mentions.user) {
    const user = userSelector(state)
    const userMentions = mentions.user.filter(userId => userId === user.id)
    count += userMentions.length
  }

  if (mentions.room) {
    const joinedRooms = joinedRoomsSelector(state)
    const joinedRoomsIds = pluck(joinedRooms, 'id')
    const roomMentions = intersection(mentions.room, joinedRoomsIds)
    count += roomMentions.length
  }

  return count
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
  const channels = channelsSelector(state)
  const currentChannel = find(channels, channel => channel.id === channelId)
  const users = usersSelector(state)
  const {displayName, avatar} = find(users, user => user.id === author.id) || {}

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
