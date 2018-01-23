import request from 'superagent'

import conf from '../../../conf'
import rpc from '../rpc'
import {sequenceToSettings, settingsToSequence} from '../notification'

export const loadConfig = ({serviceUrl, authToken}) => new Promise((resolve, reject) => {
  const req = request.get(`${serviceUrl}/api/chat/config/`)
  if (authToken) req.set('Authorization', `Token ${authToken}`)
  req.end((err, res) => {
    if (err) return reject(err)
    return resolve(res.body)
  })
})

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
        return resolve(newRoom)
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
      (err) => {
        if (err) return reject(err)
        return resolve()
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
      (err) => {
        if (err) return reject(err)
        return resolve()
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
      (err) => {
        if (err) return reject(err)
        return resolve()
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
      (err) => {
        if (err) return reject(err)
        return resolve()
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
      (err) => {
        if (err) return reject(err)
        return resolve()
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
        return resolve(mentions)
      }
    )
  })
}

export function searchMessages({query, id, limit, offsetDate, types}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'search',
        args: [
          query,
          id,
          types.join(','),
          limit,
          offsetDate
        ]
      },
      {camelize: true},
      (err, messages) => {
        if (err) return reject(err)
        return resolve(messages)
      }
    )
  })
}

export function searchMessagesInChannel({query, orgId, channelId, limit, offsetDate, types}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'search_channel',
        args: [
          query,
          orgId,
          channelId,
          types.join(','),
          limit,
          offsetDate
        ]
      },
      {camelize: true},
      (err, messages) => {
        if (err) return reject(err)
        return resolve(messages)
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
        return resolve(files)
      }
    )
  })
}

export function checkAuth() {
  return new Promise((resolve, reject) => {
    const {serviceUrl, authToken} = conf.server
    const req = request
      .get(`${serviceUrl}/accounts/session_state/`)
      .withCredentials()
    if (authToken) req.set('Authorization', `Token ${authToken}`)
    req.end((err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

export function setNotificationSetting(orgId, channelId, settings) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'notifications',
      action: 'update_settings',
      args: [`${orgId}:${channelId}`, settingsToSequence(settings)]
    }, (err) => {
      if (err) return reject(err)
      return resolve()
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
      return resolve(sequenceToSettings(sequence))
    })
  })
}

export const uploadFile = (orgId, file) => (
  request
    .post(`${conf.server.serviceUrl}${conf.server.uploadPath}`)
    .field('organization', orgId)
    .attach('file', file, file.name)
    .accept('json')
    .withCredentials()
)

export const loadLabeledMessages = (orgId, options = {}) => (
  new Promise((resolve, reject) => {
    rpc({
      ns: 'labels',
      action: 'get_labeled_messages',
      args: [orgId, options]
    },
    {camelize: true},
    (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
)

export const loadLabelsConfig = orgId => (
  new Promise((resolve, reject) => {
    rpc({
      ns: 'labels',
      action: 'get_label_configuration',
      args: [orgId]
    },
    (err, res) => {
      if (err) return reject(err)
      return resolve(res.labels)
    })
  })
)

export function autocomplete(orgId, text, options = {}) {
  return new Promise((resolve, reject) => {
    rpc(
      {
        ns: 'search',
        action: 'autocomplete',
        args: [
          text,
          orgId,
          options.showAll || false,
          // Amount of results per section.
          15,
          // Return external services too.
          true
        ]
      },
      {camelize: true},
      (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      }
    )
  })
}

export function setNotificationSession({orgId, clientId}) {
  return new Promise((resolve, reject) => {
    rpc({
      ns: 'notifications',
      action: 'set_notification_session',
      clientId,
      args: [orgId]
    }, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}
