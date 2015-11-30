import debug from 'debug'
import request from 'superagent'
import noop from 'lodash/utility/noop'
import assign from 'lodash/object/assign'

import conf from 'conf'
import * as convertCase from './convertCase'
import client from './client'

const log = debug('rpc')
let rpc

if (conf.forceLongpolling) {
  rpc = (data, callback = noop) => {
    const cData = convertCase.toSnake(data)
    log('req', cData)
    request
      .post(conf.rpcUrl)
      .send(cData)
      .end((err, res) => {
        if (err) {
          log('err', err)
          let userErr
          // When disconnected, there is no res.
          if (res && res.body && res.body.message) {
            userErr = new Error()
            assign(userErr, res.body)
          }
          return callback(userErr || err)
        }
        log('res', res.body ? res.body.response : res)
        callback(null, res.body && res.body.response)
      })
  }
}
else {
  rpc = (data, callback = noop) => {
    const cData = convertCase.toSnake(data)
    log('req', cData)
    client.call(`${cData.ns}/${cData.action}`, ...(cData.args || []), (err, res) => {
      err ? log('err', err) : log('res', res)
      callback(err, res)
    })
  }
}

export default rpc
