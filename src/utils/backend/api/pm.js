import rpc from '../rpc'

export const openPm = (orgId, userId) => rpc({
  ns: 'pm',
  action: 'open',
  args: [orgId, userId]
}, {camelize: true})

export const getPmsOverview = (orgId, excludeEmpty = false) => rpc({
  ns: 'pm',
  action: 'get_overview',
  args: [orgId, excludeEmpty]
}, {camelize: true})
