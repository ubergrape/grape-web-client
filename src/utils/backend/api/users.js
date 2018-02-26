import rpc from '../rpc'

export const getUserProfile = orgId => rpc({
  ns: 'users',
  action: 'get_profile',
  args: [
    // Will return only one particular org in organizations array.
    orgId,
    // Disables stats object which is very expensive.
    false
  ]
}, {camelize: true})

export const setShowIntro = (value = false) => rpc({
  ns: 'users',
  action: 'set_profile',
  args: [{showIntro: value}]
})

export const getUsers = ({orgId, page = 1, pageSize = 2000, userIds = []}) => rpc({
  ns: 'users',
  action: 'get_users',
  args: [
    orgId, page, pageSize, userIds.length && userIds.filter(Boolean)
  ].filter(Boolean)
}, {camelize: true})

export const getUser = (orgId, userId) => rpc({
  ns: 'users',
  action: 'get_user',
  args: [orgId, userId]
}, {camelize: true})
