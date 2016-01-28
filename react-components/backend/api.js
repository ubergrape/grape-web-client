import rpc from './rpc'

export function createRoom(room) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'create',
        args: [room]
      },
      {camelize: true},
      (err, newRoom) => {
        if (err) {
          reject(err)
        } else {
          resolve(newRoom)
        }
      }
    )
  })
}

export function joinToChannel(id) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'join',
        args: [id]
      },
      err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

export function inviteToChannel(usernames, id) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'invite',
        args: [id, usernames]
      },
      err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })
}

export function getMentions({id, limit, offsetDate}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'get_mentions',
        args: [
          id,
          'user',
          limit,
          offsetDate
        ]
      },
      {camelize: true},
      (err, mentions) => {
        if (err) {
          reject(err)
        } else {
          resolve(mentions)
        }
      }
    )
  })
}
