import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import each from 'lodash/collection/each'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'
import indexBy from 'lodash/collection/indexBy'

import staticUrl from '../utils/static-url'
import {defaultAvatar} from '../constants/images'
import {maxChannelNameLength, maxLinkAttachments} from '../constants/app'
import {channelsSelector} from '../selectors'
import * as api from '../utils/backend/api'
import conf from '../conf'

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
 * Checks if the channel where message has been posted exists.
 * This should only happen when db is inconsistent.
 */
export function doesMessageChannelExist(msg, state) {
  const channels = channelsSelector(state)
  const channel = find(channels, {id: msg.channel})
  return Boolean(channel)
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
  let creator = channel.creator
  if (creator && typeof creator === 'object') {
    creator = creator.id
  }
  let history = channel.history
  if (history && typeof history === 'object') {
    history = channel.history.map(h => (h.id ? h.id : h))
  }

  let {users} = channel
  if (users && typeof users === 'object') {
    users = users
      .filter(u => Boolean(u))
      .map(u => (u.id ? u.id : u))
  }

  return {
    ...channel,
    creator,
    history,
    users
  }
}

const setJoined = (channel, userId) => ({
  ...channel,
  joined: channel.users.indexOf(userId) !== -1
})

export function normalizeChannelData(channel, userId) {
  const normalized = nullChannelIconToUndefined(pinToFavorite(reduceChannelUsersToId(channel)))
  if (userId) return setJoined(normalized, userId)
  return normalized
}

export function normalizeUserData(user, organizations) {
  const normalized = {...user}
  if (Array.isArray(organizations)) {
    normalized.role = find(organizations, {id: conf.organization.id}).role
  }
  return normalized
}

// Load a config and caches a promise based on org id.
export const loadLabelsConfigCached = (() => {
  let promise
  let prevOrgId

  const normalize = configs => configs.map(config => ({
    name: config.name,
    nameLocalized: config.localized,
    color: config.color
  }))

  return (orgId) => {
    if (prevOrgId !== orgId) {
      prevOrgId = orgId
      promise = api
        .loadLabelsConfig(orgId)
        .then(configs => (configs ? normalize(configs) : null))
    }
    return promise
  }
})()

export const normalizeMessage = (() => {
  function normalizeLabels(labels, labelConfigs) {
    const configsMap = indexBy(labelConfigs, 'name')
    return labels
      // Just a precaution in case the config doesn't have all labels.
      .filter(label => !!configsMap[label.name])
      // Deduplicate labels. There might the same label at different position.
      .reduce((uniqLabels, label) => {
        if (!find(uniqLabels, {name: label.name})) {
          uniqLabels.push(label)
        }
        return uniqLabels
      }, [])
      .map((label) => {
        const config = configsMap[label.name]
        return {
          id: label.id,
          ...config
        }
      })
  }

  function normalizeAttachment(attachment) {
    const {id, mimeType, name, thumbnailUrl, url, category} = attachment
    const thumbnailHeight = Number(attachment.thumbnailHeight)
    const thumbnailWidth = Number(attachment.thumbnailWidth)
    const time = new Date(attachment.time)
    const sourceName = attachment.source
    const type = sourceName ? 'remoteFile' : 'uploadedFile'

    return {
      id,
      mimeType,
      name,
      url,
      category,
      thumbnailUrl,
      thumbnailWidth,
      thumbnailHeight,
      time,
      type
    }
  }

  function createLinkToMessage(channel, messageId) {
    const {serviceUrl} = conf.server
    const {users} = channel
    let {slug} = channel

    if (channel.type === 'pm') {
      slug = `${users[0].slug}/${users[1].slug}`
    }

    return `${serviceUrl}/chat/${slug}/${messageId}`
  }

  function normalizeMentions(mentions) {
    const nMentions = {...mentions}
    each(nMentions, (values, type) => {
      nMentions[type] = values.map(Number)
    })
    return nMentions
  }

  function normalizeRegularMessage(msg, state, labelConfigs) {
    const channels = channelsSelector(state)
    const {
      id, text, channel: channelId, pinned: isPinned
    } = msg
    const time = msg.time ? new Date(msg.time) : new Date()
    const userTime = msg.userTime || time.toISOString()
    const type = 'regular'
    const avatar = msg.author.avatar || defaultAvatar
    const author = {
      id: msg.author.id,
      name: msg.author.displayName || 'Deleted User',
      slug: msg.author.username ? `@${msg.author.username}` : undefined
    }

    const channel = find(channels, {id: channelId})
    const link = createLinkToMessage(channel, id)
    const attachments = (msg.attachments || []).map(normalizeAttachment)
    const mentions = normalizeMentions(msg.mentions)
    const linkAttachments = (msg.linkAttachments || []).slice(0, maxLinkAttachments)
    const labels = msg.labels && labelConfigs ? normalizeLabels(msg.labels, labelConfigs) : []

    return {
      type,
      id,
      text,
      time,
      userTime,
      author,
      link,
      avatar,
      attachments,
      mentions,
      channelId,
      channel,
      linkAttachments,
      labels,
      isPinned
    }
  }

  const ignoreActivityObjects = ['issue', 'label', 'user']

  function normalizeActivityMessage(msg, state) {
    const channels = channelsSelector(state)
    const {id, channel: channelId} = msg
    const type = 'activity'
    const time = new Date(msg.time)
    const author = {
      id: msg.author.id,
      name: msg.author.username
    }
    let avatar = staticUrl(`images/service-icons/${author.id}-64.png`)
    if (msg.author.icon) {
      avatar = `${msg.author.icon}64x64/`
    }
    let text = msg.title || msg.text

    if (msg.objects) {
      const objectsText = msg.objects
        .filter(({visible, type: _type}) => {
          if (visible === false || ignoreActivityObjects.includes(_type)) {
            return false
          }
          return true
        })
        .map(({author: _author, name, url, sha, content, summary}) => {
          let str = ''
          if (_author && _author.username) str += ` __${_author.username}__`
          if (name) str += ` __[${name}](${url})__`
          if (sha) str += ` [${sha.substr(0, 6)}](${url})`
          if (content) str += ` ${content}`
          if (summary) str += ` ${summary}`
          return str
        }).join('\n')
      text += `\n${objectsText}`
    }

    const attachments = (msg.attachments || []).map(normalizeAttachment)
    const channel = find(channels, {id: channelId})
    const link = createLinkToMessage(channel, id)

    return {type, id, channelId, channel, link, text, time, author, avatar, attachments}
  }

  // https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
  return (msg, state, labelConfigs) => {
    if (msg.author.type === 'service') {
      return normalizeActivityMessage(msg, state)
    }

    return normalizeRegularMessage(msg, state, labelConfigs)
  }
})()

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

export const findLastUsedChannel = channels => (
  channels
    .filter(channel => channel.joined)
    .sort((a, b) => b.latestMessageTime - a.latestMessageTime)[0]
)
