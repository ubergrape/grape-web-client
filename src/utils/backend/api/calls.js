import rpc from '../rpc'

export const cancelCall = channelId =>
  rpc(
    {
      ns: 'calls',
      action: 'cancel',
      args: [{ channelId }],
    },
    { camelize: true },
  )

export const joinCall = (channelId, callerId) =>
  rpc(
    {
      ns: 'calls',
      action: 'join',
      args: [{ channelId, callerId }],
    },
    { camelize: true },
  )

export const rejectCall = (channelId, callerId) =>
  rpc(
    {
      ns: 'calls',
      action: 'reject',
      args: [{ channelId, callerId }],
    },
    { camelize: true },
  )
