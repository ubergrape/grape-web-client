import rpc from '../backend/rpc'

export function createRoom(room, success, error) {
  rpc(
    {
      ns: 'rooms',
      action: 'create',
      args: [room]
    },
    {camelize: true},
    (err, newRoom) => {
      if (err) return error(err)
      if (success) return success(newRoom)
    }
  )
}

export function joinToChannel(id, success, error) {
  rpc(
    {
      ns: 'channels',
      action: 'join',
      args: [id]
    },
    err => {
      if (err) return error(err)
      if (success) return success()
    }
  )
}

export function inviteToChannel(usernames, id, success, error) {
  rpc(
    {
      ns: 'channels',
      action: 'invite',
      args: [id, usernames]
    },
    err => {
      if (err) return error(err)
      if (success) return success()
    }
  )
}
