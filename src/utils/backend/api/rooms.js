import rpc from '../rpc'

export const createRoom = roomId => rpc({
  ns: 'rooms',
  action: 'create',
  args: [roomId]
}, {camelize: true})

export const listMembers = roomId => rpc({
  ns: 'rooms',
  action: 'list_members',
  args: [roomId]
}, {camelize: true})

export const renameRoom = (id, name) => rpc({
  ns: 'rooms',
  action: 'rename',
  args: [id, name]
})

export const setRoomDescription = (id, description) => rpc({
  ns: 'rooms',
  action: 'set_description',
  args: [id, description]
})

export const setRoomPrivacy = (id, isPublic) => rpc({
  ns: 'rooms',
  action: 'set_public',
  args: [id, isPublic]
})

export const setRoomColor = (id, color) => rpc({
  ns: 'rooms',
  action: 'set_color',
  args: [id, color]
})

export const setRoomIcon = (id, icon) => rpc({
  ns: 'rooms',
  action: 'set_icon',
  args: [id, icon]
})
