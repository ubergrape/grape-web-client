import rpc from './rpc'
import request from 'superagent'

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
        if (err) return reject(err)
        resolve(newRoom)
      }
    )
  })
}

export function joinChannel(channelId) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'join',
        args: [channelId]
      },
      err => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function inviteToChannel(usernames, channelId) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'invite',
        args: [channelId, usernames]
      },
      err => {
        if (err) return reject(err)
        resolve()
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
        if (err) return reject(err)
        resolve(mentions)
      }
    )
  })
}

export function searchMessages({query, id, limit, offsetDate}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'search',
        args: [
          query,
          id,
          'messages',
          limit,
          offsetDate
        ]
      },
      {camelize: true},
      (err, messages) => {
        if (err) return reject(err)
        resolve(messages)
      }
    )
  })
}

export function searchFiles({orgId, channelId, own, limit, offset}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'search_files',
        args: [
          orgId,
          channelId,
          own,
          limit,
          offset
        ]
      },
      {camelize: true},
      (err, files) => {
        if (err) return reject(err)
        resolve(files)
      }
    )
  })
}

// https://github.com/ubergrape/chatgrape/issues/3291
export function checkAuth() {
  return new Promise((resolve, reject) => {
    request
      .get('/accounts/session_state')
      .end(err => reject(err))
  })
}
