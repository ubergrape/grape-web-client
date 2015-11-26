import request from 'superagent'
import noop from 'lodash/utility/noop'
import assign from 'lodash/object/assign'

import conf from 'conf'
import * as convertCase from './convertCase'
import client from './client'

let rpc

if (conf.forceLongpolling) {
  rpc = (data, callback = noop) => {
    request
      .post(conf.rpcUrl)
      .send(convertCase.toSnake(data))
      .end((err, res) => {
        if (err) {
          let userErr
          // When disconnected, there is no res.
          if (res && res.body && res.body.message) {
            userErr = new Error()
            assign(userErr, res.body)
          }
          return callback(userErr || err)
        }
        callback(null, res.body && res.body.response)
      })
  }
}
else {
  rpc = (data, callback = noop) => {
    client.call(`${data.ns}/${data.action}`, ...(data.args || []), callback)
  }
}

export default rpc
