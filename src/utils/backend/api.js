import request from 'superagent'

import conf from 'conf'

import rpc from './rpc'
import {toSnake} from './convertCase'
import {
  getSequence as getNotificationSequence,
  getOptions as getNotificationOptions
} from './notification'

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

export function renameRoom(id, name) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'rename',
        args: [id, name]
      },
      {camelize: true},
      err => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function setRoomDescription(id, description) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'set_description',
        args: [id, description]
      },
      {camelize: true},
      err => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function setRoomPrivacy(id, isPublic) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'set_public',
        args: [id, isPublic]
      },
      {camelize: true},
      err => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function setRoomColor(id, color) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'set_color',
        args: [id, color]
      },
      {camelize: true},
      err => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function setRoomIcon(id, icon) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'rooms',
        action: 'set_icon',
        args: [id, icon]
      },
      {camelize: true},
      err => {
        if (err) return reject(err)
        resolve()
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

export function getMentions({id, limit, options: {showRoomMentions}, offsetDate}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'get_mentions',
        args: [
          id,
          showRoomMentions ? null : 'user',
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

export function searchMessagesInChannel({query, orgId, channelId, limit, offsetDate}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'search_channel',
        args: [
          query,
          orgId,
          channelId,
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

export function getFavorites(orgId) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'get_pins',
        args: [orgId]
      },
      {camelize: true},
      (err, favorites) => {
        if (err) return reject(err)
        resolve(favorites)
      }
    )
  })
}

export function addToFavorite(channelId) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'set_pin',
        args: [channelId]
      },
      {camelize: true},
      (err) => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function removeFromFavorite(channelId) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'channels',
        action: 'remove_pin',
        args: [channelId]
      },
      {camelize: true},
      (err) => {
        if (err) return reject(err)
        resolve()
      }
    )
  })
}

export function checkAuth() {
  return new Promise((resolve, reject) => {
    const {host, protocol, authToken} = conf.server
    const req = request.get(`${protocol}//${host}/accounts/session_state/`)
    if (authToken) req.set('Authorization', `Token ${authToken}`)
    req.end(err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function loadHistory(channelId, options = {}) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'channels',
      action: 'get_history',
      args: [channelId, options]
    },
    {camelize: true},
    (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

/**
 * Load history at a position of specified message id.
 */
export function loadHistoryAt(channelId, messageId, options = {}) {
  return new Promise((resolve, reject) => {
    // Amount of messages before the passed message id.
    const before = Math.round(options.limit / 2)
    // Amount of messages after the passed message id.
    const after = before
    // Return an error when message id not found, otherwise return fallback results.
    const strict = true

    rpc({
      ns: 'channels',
      action: 'focus_message',
      args: [channelId, messageId, before, after, strict]
    },
    {camelize: true},
    (err, res) => {
      if (err) return reject(err)
      resolve(res)
    })
  })
}

export function removeMessage(channelId, messageId) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'channels',
      action: 'delete_message',
      args: [channelId, messageId]
    },
    err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function postMessage(channelId, text, options) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'channels',
      action: 'post',
      args: [channelId, text, options]
    },
    err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function readMessage(channelId, messageId) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'channels',
      action: 'read',
      args: [channelId, messageId]
    },
    err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function getInviteToOrgLink(orgId) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'organizations',
      action: 'get_invite_url',
      args: [orgId]
    },
    (err, link) => {
      if (err) return reject(err)
      resolve(link)
    })
  })
}

export function inviteToOrg(orgId, settings) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'organizations',
      action: 'invite',
      args: [orgId, settings]
    },
    err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function loadConfig() {
  return new Promise((resolve, reject) => {
    const {host, protocol, authToken} = conf.server
    const orgSubdomain = host.split('.')[0]
    const req = request.get(`${protocol}//${host}/api/chat/config/`)
    if (authToken) req.set('Authorization', `Token ${authToken}`)
    req
      .query(toSnake({orgSubdomain}))
      .end((err, res) => {
        if (err) return reject(err)
        resolve(res.body)
      })
  })
}

export function setNotificationSetting(orgId, channelId, options) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'notifications',
      action: 'update_settings',
      args: [`${orgId}:${channelId}`, getNotificationSequence(options)]
    }, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export function getNotificationSettings(orgId, channelId) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'notifications',
      action: 'get_settings',
      args: [`${orgId}:${channelId}`]
    }, (err, sequence) => {
      if (err) return reject(err)
      resolve(getNotificationOptions(sequence))
    })
  })
}

export function getDefaultNotificationSettingName(orgId) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'notifications',
      action: 'get_settings',
      args: [String(orgId)]
    }, (err, sequence) => {
      if (err) return reject(err)
//      console.log('org sequence', sequence)
      sequence()
      resolve({name})
    })
  })
}
