import debug from 'debug'
import request from 'superagent'
import noop from 'lodash/utility/noop'
import assign from 'lodash/object/assign'

import conf from 'conf'
import {toSnake, toCamel} from './convertCase'
import client from './client'

const log = debug('rpc')
let rpc

if (conf.forceLongpolling) {
  rpc = (data, callback) => {
    request
      .post(conf.rpcUrl)
      .send(data)
      .end((err, res) => {
        if (err) {
          let userErr
          // When disconnected, there is no res.
          if (res && res.body && res.body.message) {
            userErr = new Error()
            assign(userErr, res.body)
          }
          log('err', userErr || err)
          return callback(userErr || err)
        }
        log('res', res.body ? res.body.response : res)
        callback(null, res.body && res.body.response)
      })
  }
}
else {
  rpc = (data, callback) => {
    client.call(`${data.ns}/${data.action}`, ...(data.args || []), (err, res) => {
      err ? log('err', err, err.details) : log('res', res)
      callback(err, res)
    })
  }
}

export default function(data, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  const cData = toSnake(data)
  log('req', cData)
  rpc(data, (err, res) => {
    if (!callback) return
    callback(err, options.camelize && res ? toCamel(res) : res)
  })
}
