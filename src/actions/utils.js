import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'
import staticUrl from 'staticurl'

import {defaultAvatar} from '../constants/images'
import {maxChannelNameLength} from '../constants/app'
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

/**
 * Change `null` value in `icon` property to `undefined`.
 *
 * TODO: remove this function when we
 * will get data only from backend and
 * not from old frontend architecture
 */
export function nullChannelIconToUndefined(channel) {
  if (channel.icon === null) return {...channel, icon: undefined}
  return channel
}

export function pinToFavorite(channel) {
  const {pin} = channel
  const newChannel = {
    ...channel,
    favorited: (pin || pin === 0) ? {order: pin} : null
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

export function normalizeChannelData(channel) {
  return nullChannelIconToUndefined(pinToFavorite(reduceChannelUsersToId(channel)))
}

export const formatMessage = (() => {
  function formatRegularMessage(msg, state) {
    const channels = channelsSelector(state)
    const users = usersSelector(state)

    const {id, text, userTime, mentions} = msg
    const time = new Date(msg.time)
    const type = 'regular'
    let author
    let avatar

    const fullAuthor = find(users, {id: msg.author.id})
    if (fullAuthor) {
      author = {
        id: String(fullAuthor.id),
        name: fullAuthor.displayName
      }
      avatar = fullAuthor.avatar
    } else {
      author = {
        id: String(msg.author.id),
        name: 'Deleted User'
      }
      avatar = defaultAvatar
    }
    const channel = find(channels, {id: msg.channel})
    const link = `${location.protocol}//${location.host}/chat/${channel.slug}/${id}`
    const attachments = []
    return {
      type, id, text, time, userTime, author, link, avatar, channel, attachments,
      mentions
    }
  }

  function formatActivityMessage(msg) {
    const {id} = msg
    const type = 'activity'
    const time = new Date(msg.time)
    const author = {
      id: String(msg.author.id),
      name: msg.author.username
    }
    const avatar = staticUrl(`images/service-icons/${author.id}-64.png`)
    const text = msg.title

    return {type, id, text, time, author, avatar}
  }

  // https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
  return (msg, state) => {
    if (msg.author.type === 'service') {
      return formatActivityMessage(msg)
    }

    return formatRegularMessage(msg, state)
  }
}())

export function filterEmptyMessage(message) {
  return message.text.trim().length !== 0 || !isEmpty(message.attachments)
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

export function roomNameFromUsers(users) {
  return users.map(user => user.displayName)
  .join(', ')
  .slice(0, maxChannelNameLength - 1)
}
