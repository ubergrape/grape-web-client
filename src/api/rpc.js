import request from 'superagent'
import noop from 'lodash/utility/noop'
import assign from 'lodash/object/assign'

import conf from 'conf'
import convertCase from './convertCase'

export default function rpc(data, callback = noop) {
  request
    .post(conf.rpcUrl)
    .send(convertCase.toSnake(data))
    .end((err, res) => {
      if (err) {
        let userErr
        if (res.body && res.body.message) {
          userErr = new Error()
          assign(userErr, res.body)
        }
        return callback(userErr || err)
      }
      callback(null, res.body && res.body.response)
    })
}
