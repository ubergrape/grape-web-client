import find from 'lodash/collection/find'
import pluck from 'lodash/collection/pluck'
import intersection from 'lodash/array/intersection'
import isEmpty from 'lodash/lang/isEmpty'

import store from '../app/store'
import {orgSelector, usersSelector, userSelector, channelsSelector} from '../selectors'

export function formatMessage(message) {
  const fMessage = {...message}
  fMessage.time = new Date(message.time)
  return fMessage
}

export function formatSidebarMessage(message) {
  const fMessage = formatMessage(message)
  const state = store.getState()
  const {channels} = orgSelector(state)
  const channel = find(channels, ({id}) => id === fMessage.channel)
  const users = usersSelector(state)
  const author = find(users, ({id}) => id === fMessage.author.id)

  return {
    id: fMessage.id,
    channel: channel.name || channel.users[0].displayName,
    author: author.displayName,
    avatar: author.avatar,
    time: fMessage.time,
    content: fMessage.plainText,
    slug: channel.slug || channel.users[0].slug
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

  let mentioned = false

  if (mentions.user) {
    mentioned = mentions.user.some(userId => userId === user.id)
    if (mentioned) return true
  }

  if (mentions.room) {
    const channels = channelsSelector(state)
    const joinedChannels = channels.filter(channel => channel.joined)
    const joinedChannelIds = pluck(joinedChannels, 'id')
    mentioned = intersection(mentions.room, joinedChannelIds).length > 0
  }

  return mentioned
}
