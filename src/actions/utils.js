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

export const normalizeMessage = (() => {
  function normalizeAttachment(attachment) {
    const {id, mimeType, name, thumbnailUrl, url, category} = attachment
    const thumbnailHeight = Number(attachment.thumbnailHeight)
    const thumbnailWidth = Number(attachment.thumbnailWidth)
    const time = new Date(attachment.time)
    const sourceName = attachment.source
    const type = sourceName ? 'remoteFile' : 'uploadedFile'

    return {
      id, mimeType, name, url, category, thumbnailUrl, thumbnailWidth,
      thumbnailHeight, time, type
    }
  }

  function normalizeRegularMessage(msg, state) {
    const channels = channelsSelector(state)
    const users = usersSelector(state)

    const {id, text, mentions} = msg
    const time = msg.time ? new Date(msg.time) : new Date()
    const userTime = msg.userTime || time.toISOString()
    const type = 'regular'
    let author
    let avatar

    const fullAuthor = find(users, {id: msg.author.id})
    if (fullAuthor) {
      author = {
        id: fullAuthor.id,
        name: fullAuthor.displayName
      }
      avatar = fullAuthor.avatar
    } else {
      author = {
        id: msg.author.id,
        name: 'Deleted User'
      }
      avatar = defaultAvatar
    }

    const {channel} = msg
    const {slug} = find(channels, {id: channel})
    const link = `${location.protocol}//${location.host}/chat/${slug}/${id}`
    const attachments = msg.attachments.map(normalizeAttachment)
    return {
      type, id, text, time, userTime, author, link, avatar, channel, attachments,
      mentions
    }
  }

  function normalizeActivityMessage(msg) {
    const {id, channel} = msg
    const type = 'activity'
    const time = new Date(msg.time)
    const author = {
      id: msg.author.id,
      name: msg.author.username
    }
    const avatar = staticUrl(`images/service-icons/${author.id}-64.png`)
    const text = msg.title || msg.text

    return {type, id, channel, text, time, author, avatar, attachments: []}
  }

  // https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
  return (msg, state) => {
    if (msg.author.type === 'service') {
      return normalizeActivityMessage(msg)
    }

    return normalizeRegularMessage(msg, state)
  }
}())

export function filterEmptyMessage({text, attachments}) {
  return (text && text.trim().length !== 0) || !isEmpty(attachments)
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
