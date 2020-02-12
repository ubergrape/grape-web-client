import rpc from '../rpc'

export const getInviteToOrgLink = orgId =>
  rpc(
    {
      ns: 'organizations',
      action: 'get_invite_url',
      args: [orgId],
    },
    { camelize: true },
  )

export const inviteToOrg = (orgId, settings) =>
  rpc(
    {
      ns: 'organizations',
      action: 'invite',
      args: [orgId, settings],
    },
    { camelize: true },
  )

export const getOrg = orgId =>
  rpc(
    {
      ns: 'organizations',
      action: 'get_organization',
      args: [orgId, { return_users: false, return_channels: false }],
    },
    { camelize: true },
  )

export const joinOrg = (orgId, clientId) =>
  rpc({
    ns: 'organizations',
    action: 'join',
    clientId,
    args: [orgId],
  })
