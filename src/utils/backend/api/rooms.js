import rpc from '../rpc'

export const createRoom = room => rpc({
  ns: 'rooms',
  action: 'create',
  args: [room]
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
