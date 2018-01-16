import rpc from '../rpc'

export const searchUsers = ({orgId, search = '', limit}) => rpc({
  ns: 'search',
  action: 'search_users',
  args: [orgId, search, limit]
}, {camelize: true})
