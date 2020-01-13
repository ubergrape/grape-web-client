import request from 'superagent'

import { toCamel } from '../../convert-case'
import conf from '../../../conf'

export const loadConfig = ({ serviceUrl, authToken }) =>
  new Promise((resolve, reject) => {
    const req = request.get(`${serviceUrl}/api/chat/config/`).withCredentials()
    if (authToken) req.set('Authorization', `Token ${authToken}`)
    req.end((err, res) => {
      if (err) return reject(err)
      return resolve(toCamel(res.body))
    })
  })

export const checkAuth = () =>
  new Promise((resolve, reject) => {
    const { serviceUrl, authToken } = conf.server
    const req = request
      .get(`${serviceUrl}/accounts/session_state/`)
      .withCredentials()
    if (authToken) req.set('Authorization', `Token ${authToken}`)
    req.end(err => {
      if (err) return reject(err)
      return resolve()
    })
  })

export const uploadFile = (orgId, file) =>
  request
    .post(`${conf.server.serviceUrl}${conf.server.uploadPath}`)
    .field('organization', orgId)
    .attach('file', file, file.name)
    .accept('json')
    .withCredentials()
