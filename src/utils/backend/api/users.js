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

export const getUsers = ({orgId, page = 1, pageSize = 2000, userIds}) => rpc({
  ns: 'users',
  action: 'get_users',
  args: [orgId, page, pageSize, userIds]
}, {camelize: true})

export const getUser = (orgId, userId) => rpc({
  ns: 'users',
  action: 'get_user',
  args: [orgId, userId]
}, {camelize: true})
