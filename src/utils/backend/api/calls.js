import rpc from '../rpc'

export const cancelCall = args =>
  rpc(
    {
      ns: 'calls',
      action: 'cancel',
      args: [args],
    },
    { camelize: true },
  )

export const hangUp = args =>
  rpc(
    {
      ns: 'calls',
      action: 'hangup',
      args: [args],
    },
    { camelize: true },
  )

export const rejectCall = args =>
  rpc(
    {
      ns: 'calls',
      action: 'reject',
      args: [args],
    },
    { camelize: true },
  )
