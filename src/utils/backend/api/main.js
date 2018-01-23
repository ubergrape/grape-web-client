import request from 'superagent'

import conf from '../../../conf'
import rpc from '../rpc'

export const loadConfig = ({serviceUrl, authToken}) => new Promise((resolve, reject) => {
  const req = request.get(`${serviceUrl}/api/chat/config/`)
  if (authToken) req.set('Authorization', `Token ${authToken}`)
  req.end((err, res) => {
    if (err) return reject(err)
    return resolve(res.body)
  })
})

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
