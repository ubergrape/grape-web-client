import * as convertCase from '../../api/convertCase'

/**
 * Format a message for rendering.
 */
export function formatMessage(message) {
  const {channel} = message
  return {
    id: message.id,
    channel: channel.name || channel.users[0].displayName,
    author: message.author.displayName,
    avatar: message.author.avatar,
    time: message.time,
    content: message.plainText,
    slug: channel.slug || channel.users[0].slug
  }
}
