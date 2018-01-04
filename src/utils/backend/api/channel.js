import rpc from '../rpc'

export const kickMemberFromChannel = (channelId, userId) => rpc({
  ns: 'channels',
  action: 'kick',
  args: [channelId, userId]
})
