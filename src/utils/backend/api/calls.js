import rpc from '../rpc'

export const rejectCall = (channelId, callerId) =>
  rpc(
    {
      ns: 'calls',
      action: 'call',
      args: [{ channelId, callerId }],
    },
    { camelize: true },
  )
