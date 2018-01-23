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
