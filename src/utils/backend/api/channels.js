import rpc from '../rpc'

export const kickMemberFromChannel = (channelId, userId) => rpc({
  ns: 'channels',
  action: 'kick',
  args: [channelId, userId]
})

export const leaveChannel = channelId => rpc({
  ns: 'channels',
  action: 'leave',
  args: [channelId]
})

export const pinMessage = (channelId, messageId) => rpc({
  ns: 'channels',
  action: 'pin_message',
  args: [channelId, messageId, true]
})

export const unpinMessage = (channelId, messageId) => rpc({
  ns: 'channels',
  action: 'pin_message',
  args: [channelId, messageId, false]
})

export const loadPinnedMessages = channelId => rpc({
  ns: 'channels',
  action: 'get_pinned_messages',
  args: [channelId]
}, {camelize: true})

export const getChannel = channelId => rpc({
  ns: 'channels',
  action: 'get',
  args: [channelId]
}, {camelize: true})

export const deleteChannel = (channelId, name) => rpc({
  ns: 'channels',
  action: 'delete',
  args: [channelId, name]
})

export const joinChannel = channelId => rpc({
  ns: 'channels',
  action: 'join',
  args: [channelId]
})

export const inviteToChannel = (emailAddresses, channelId) => rpc({
  ns: 'channels',
  action: 'invite',
  args: [channelId, emailAddresses]
})

export const getPinnedChannels = orgId => rpc({
  ns: 'channels',
  action: 'get_pins',
  args: [orgId]
}, {camelize: true})

export const addChannelToFavorites = channelId => rpc({
  ns: 'channels',
  action: 'set_pin',
  args: [channelId]
})

export const removeChannelFromFavorites = channelId => rpc({
  ns: 'channels',
  action: 'remove_pin',
  args: [channelId]
})

export const loadHistory = (channelId, options = {}) => rpc({
  ns: 'channels',
  action: 'get_history',
  args: [channelId, options]
}, {camelize: true})

/**
 * Load history at a position of specified message id.
 */
export const loadHistoryAt = (channelId, messageId, options = {}) => {
  // Amount of messages before the passed message id.
  const before = Math.round(options.limit / 2)
  // Amount of messages after the passed message id.
  const after = before
  // Return an error when message id not found, otherwise return fallback results.
  const strict = true

  return rpc({
    ns: 'channels',
    action: 'focus_message',
    args: [channelId, messageId, before, after, strict]
  }, {camelize: true})
}
