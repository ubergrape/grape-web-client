import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'

import store from '../components/app/store'
import {
  usersSelector,
  channelsSelector
} from '../selectors'

/**
 * Fix data inconsistencies at the backend.
 * There are some PM's with only one participant.
 */
export function removeBrokenPms(channel) {
  const {type, users} = channel
  if (type === 'pm' && users.length !== 2) return false
  return true
}

export function pinToFavorite(channel) {
  const {pin} = channel
  const newChannel = {
    ...channel,
    favorited: (pin || pin === 0) ? { order: pin } : null
  }
  delete newChannel.pin
  return newChannel
}

/**
 * Convert `users` objects array at the `channel` object
 * to the array of users ids only.
 * If array item hasn't the `id` property
 * we're assuming it is id itself.
 *
 * TODO: remove this function when we
 * will get data only from backend and
 * not from old frontend architecture
 */
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
export function countMentions(message, user, rooms) {
  const {mentions} = message
  let count = 0
  if (isEmpty(mentions)) return count

  if (mentions.user) {
    const userMentions = mentions.user.filter(userId => userId === user.id)
    count += userMentions.length
  }

  if (mentions.room) {
    const joinedRoomsIds = pluck(rooms, 'id')
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
  // TODO: move state dependendcies to the function arguments.
  // So the action creators should pass them.
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
