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

export const joinCall = channelId =>
  rpc(
    {
      ns: 'calls',
      action: 'join',
      args: [{ channelId }],
    },
    { camelize: true },
  )

export const hangUp = channelId =>
  rpc(
    {
      ns: 'calls',
      action: 'hangup',
      args: [{ channelId }],
    },
    { camelize: true },
  )

export const rejectCall = channelId =>
  rpc(
    {
      ns: 'calls',
      action: 'reject',
      args: [{ channelId }],
    },
    { camelize: true },
  )
