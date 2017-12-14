import rpc from '../rpc'

export const setShowIntro = (value = false) => rpc({
  ns: 'users',
  action: 'set_profile',
  args: [{showIntro: value}]
})

export const searchUsers = ({orgId, search = '', limit}) => rpc({
  ns: 'search',
  action: 'search_users',
  args: [orgId, search, limit]
}, {camelize: true})
