import rpc from '../rpc'

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
})
