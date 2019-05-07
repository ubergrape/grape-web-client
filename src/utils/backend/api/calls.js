import rpc from '../rpc'

export const call = channelId =>
  rpc(
    {
      ns: 'calls',
      action: 'call',
      args: [{ channelId }],
    },
    { camelize: true },
  )
