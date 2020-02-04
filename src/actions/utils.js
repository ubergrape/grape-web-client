import find from 'lodash/find'
import each from 'lodash/each'
import isEmpty from 'lodash/isEmpty'
import keyBy from 'lodash/keyBy'

import camelCase from 'lodash/camelCase'
import staticUrl from '../utils/static-url'
import { defaultAvatar, invitedAvatar } from '../constants/images'
import { maxChannelNameLength, maxLinkAttachments } from '../constants/app'
import { channelsSelector } from '../selectors'
import conf from '../conf'

/**
 * Checks if the channel where message has been posted exists.
 * This should only happen when db is inconsistent.
 */
export function doesMessageChannelExist(msg, state) {
  const channels = channelsSelector(state)
  const channel = find(channels, { id: msg.channel })
  return Boolean(channel)
}

export const countChannelMentions = channel => {
  const { groupMentions } = channel
  const newChannel = {
    ...channel,
    mentions: channel.mentions + groupMentions,
  }
  delete newChannel.groupMentions
  return newChannel
}

export const pinToFavorite = channel => {
  const { pin } = channel
  const newChannel = {
    ...channel,
    favorited: pin || pin === 0 ? { order: pin } : null,
  }
  delete newChannel.pin
  return newChannel
}

export const lastMessageToLastMessageTime = channel => {
  const { lastMessage } = channel

  const newChannel = {
    ...channel,
    lastMessageTime: lastMessage ? lastMessage.time : null,
  }

  delete newChannel.lastMessage
  return newChannel
}

export function normalizeChannelData(channel) {
  const normalized = lastMessageToLastMessageTime(
    pinToFavorite(countChannelMentions(channel)),
  )
  return normalized
}

export function normalizeUserData(user, organizations) {
  const normalized = {
    isActive: true,
    ...user,
    avatar: user.isOnlyInvited ? invitedAvatar : user.avatar || defaultAvatar,
  }

  if (Array.isArray(organizations)) {
    normalized.role = find(organizations, { id: conf.organization.id }).role
  }

  return normalized
}

export const normalizeMessage = (() => {
  function normalizeLabels(labels, labelsConfig) {
    const configsMap = keyBy(labelsConfig, 'name')
    return (
      labels
        // Just a precaution in case the config doesn't have all labels.
        .filter(label => !!configsMap[label.name])
        // Deduplicate labels. There might the same label at different position.
        .reduce((uniqLabels, label) => {
          if (!find(uniqLabels, { name: label.name })) {
            uniqLabels.push(label)
          }
          return uniqLabels
        }, [])
        .map(label => {
          const config = configsMap[label.name]
          return {
            id: label.id,
            ...config,
          }
        })
    )
  }

  function normalizeAttachment(attachment) {
    const { id, mimeType, name, thumbnailUrl, url, category, time } = attachment
    const thumbnailHeight = Number(attachment.thumbnailHeight)
    const thumbnailWidth = Number(attachment.thumbnailWidth)
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
      type,
    }
  }

  function createLinkToMessage(channelId, messageId) {
    const { serviceUrl } = conf.server
    return `${serviceUrl}/chat/channel/${channelId}:${messageId}/`
  }

  function normalizeMentions(mentions) {
    const nMentions = { ...mentions }
    each(nMentions, (values, type) => {
      nMentions[type] = values.map(Number)
    })
    return nMentions
  }

  function normalizeRegularMessage(msg, state, configs) {
    const channels = channelsSelector(state)
    const {
      id,
      clientsideId,
      text,
      pinned: isPinned,
      action,
      state: msgState,
      docType,
    } = msg
    const time = msg.time || new Date().toISOString()
    const userTime = msg.userTime || time
    const type = 'regular'
    const avatar = msg.author.avatar || msg.avatar || defaultAvatar
    const tag = camelCase(msg.tag)
    const author = {
      id: msg.author.id,
      name: msg.author.displayName || msg.author.name || 'Deleted User',
    }

    const channelId = msg.channelId || msg.channel
    const channel = find(channels, { id: channelId })

    const link = createLinkToMessage(channelId, id)
    const attachments = (msg.attachments || []).map(normalizeAttachment)
    const mentions = normalizeMentions(msg.mentions)
    const linkAttachments = (msg.linkAttachments || []).slice(
      0,
      maxLinkAttachments,
    )
    const labels =
      msg.labels && configs ? normalizeLabels(msg.labels, configs) : []

    return {
      type,
      id,
      clientsideId,
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
      isPinned,
      tag,
      action,
      state: msgState,
      docType,
    }
  }

  const ignoreActivityObjects = ['issue', 'label', 'user']

  function normalizeActivityMessage(msg, state) {
    const channels = channelsSelector(state)
    const { id } = msg
    const type = 'activity'
    const time = msg.time || new Date().toISOString()
    const author = {
      id: msg.author.id,
      name: msg.author.username,
    }
    let avatar = staticUrl(`images/service-icons/${author.id}-64.png`)
    if (msg.author.icon) {
      avatar = `${msg.author.icon}64x64/`
    }
    let text = msg.title || msg.text

    if (msg.objects) {
      const objectsText = msg.objects
        .filter(({ visible, type: _type }) => {
          if (visible === false || ignoreActivityObjects.includes(_type)) {
            return false
          }
          return true
        })
        .map(({ author: _author, name, url, sha, content, summary }) => {
          let str = ''
          if (_author && _author.username) str += ` __${_author.username}__`
          if (name) str += ` __[${name}](${url})__`
          if (sha) str += ` [${sha.substr(0, 6)}](${url})`
          if (content) str += ` ${content}`
          if (summary) str += ` ${summary}`
          return str
        })
        .join('\n')
      text += `\n${objectsText}`
    }

    const attachments = (msg.attachments || []).map(normalizeAttachment)
    const linkAttachments = (msg.linkAttachments || []).slice(
      0,
      maxLinkAttachments,
    )
    const channelId = msg.channelId || msg.channel

    const channel = find(channels, { id: channelId })
    const link = createLinkToMessage(channelId, id)

    return {
      type,
      id,
      channelId,
      channel,
      link,
      text,
      time,
      author,
      avatar,
      attachments,
      linkAttachments,
    }
  }

  // https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
  return (msg, state, labelsConfig) => {
    if (msg.author.type === 'service') {
      return normalizeActivityMessage(msg, state)
    }

    return normalizeRegularMessage(msg, state, labelsConfig)
  }
})()

export function filterEmptyMessage({ text, attachments }) {
  return (text && text.trim().length !== 0) || !isEmpty(attachments)
}

export function roomNameFromUsers(users) {
  return users
    .map(user => user.displayName)
    .join(', ')
    .slice(0, maxChannelNameLength - 1)
}

export const findLastUsedChannel = channels =>
  channels
    .filter(channel => channel.lastMessageTime)
    .sort((a, b) => b.lastMessageTime - a.lastMessageTime)[0]
