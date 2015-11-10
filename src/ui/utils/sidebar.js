import * as convertCase from '../../api/convertCase'

/**
 * Format a message for rendering.
 */
export function formatMessage(message) {
  const {channel} = message
  // Only required because it can come from pubsub.
  const camMessage = convertCase.toCamel(message.toJSON())
  return {
    id: camMessage.id,
    channel: channel.name || channel.users[0].displayName,
    author: camMessage.author.displayName,
    avatar: camMessage.author.avatar,
    time: camMessage.time,
    content: camMessage.plainText,
    slug: channel.slug || channel.users[0].slug
  }
}
