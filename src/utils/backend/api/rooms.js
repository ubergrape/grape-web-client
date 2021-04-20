import rpc from '../rpc'

export const createGroup = params =>
  rpc(
    {
      ns: 'rooms',
      action: 'create',
      args: [params],
    },
    { camelize: true },
  )

export const listMembers = (roomId, options) =>
  rpc(
    {
      ns: 'rooms',
      action: 'list_members',
      args: [roomId, options],
    },
    { camelize: true },
  )

export const renameRoom = (roomId, name) =>
  rpc({
    ns: 'rooms',
    action: 'rename',
    args: [roomId, name],
  })

export const setRoomDescription = (roomId, description) =>
  rpc({
    ns: 'rooms',
    action: 'set_description',
    args: [roomId, description],
  })

export const setRoomPrivacy = (roomId, isPublic) =>
  rpc({
    ns: 'rooms',
    action: 'set_public',
    args: [roomId, isPublic],
  })

export const setRoomColor = (roomId, color) =>
  rpc({
    ns: 'rooms',
    action: 'set_color',
    args: [roomId, color],
  })

export const setRoomIcon = (roomId, icon) =>
  rpc({
    ns: 'rooms',
    action: 'set_icon',
    args: [roomId, icon],
  })

export const getRooms = (orgId, params) =>
  rpc(
    {
      ns: 'rooms',
      action: 'get_rooms',
      args: [orgId, params],
    },
    { camelize: true },
  )
