import rpc from '../rpc'

export const openPm = (orgId, userId) =>
  rpc(
    {
      ns: 'pm',
      action: 'open',
      args: [orgId, userId],
    },
    { camelize: true },
  )
