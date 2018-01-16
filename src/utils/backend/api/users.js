import rpc from '../rpc'

export const getUserProfile = () => rpc({
  ns: 'users',
  action: 'get_profile'
}, {camelize: true})

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
