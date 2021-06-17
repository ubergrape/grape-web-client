import rpc from '../rpc'

export const getUserProfile = orgId =>
  rpc(
    {
      ns: 'users',
      action: 'get_profile',
      args: [
        // Will return only one particular org in organizations array.
        orgId,
        // Disables stats object which is very expensive.
        false,
      ],
    },
    { camelize: true },
  )

export const setProfile = (value = {}) =>
  rpc({
    ns: 'users',
    action: 'set_profile',
    args: [value],
  })

export const getUser = (orgId, userId) =>
  rpc(
    {
      ns: 'users',
      action: 'get_user',
      args: [orgId, userId],
    },
    { camelize: true },
  )

export const getUsers = (orgId, params) =>
  rpc(
    {
      ns: 'users',
      action: 'get_users',
      args: [orgId, params],
    },
    { camelize: true },
  )
