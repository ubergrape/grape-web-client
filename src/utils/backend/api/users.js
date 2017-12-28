import rpc from '../rpc'

export const setShowIntro = (value = false) => rpc({
  ns: 'users',
  action: 'set_profile',
  args: [{showIntro: value}]
})

export const getUsers = ({orgId, page = 1, pageSize = 1500}) => rpc({
  ns: 'users',
  action: 'get_users',
  args: [orgId, page, pageSize]
}, {camelize: true})

export const searchUsers = ({orgId, search = '', limit}) => rpc({
  ns: 'search',
  action: 'search_users',
  args: [orgId, search, limit]
}, {camelize: true})
