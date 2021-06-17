import debug from 'debug'
import request from 'superagent'
import assign from 'lodash/assign'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import conf from '../../conf'
import { toSnake, toCamel } from '../convert-case'
import client from './client'

const log = debug('rpc')
let rpc

if (__TEST__) {
  // eslint-disable-next-line global-require
  const dataMocks = require('../../../jest/mocks/dataMocks').default
  rpc = (data, callback) => {
    const camelizedData = toCamel(data)
    const res = dataMocks[
      `${camelizedData.ns}${upperFirst(camelCase(camelizedData.action))}`
    ](camelizedData)
    callback(
      // eslint-disable-next-line no-underscore-dangle
      global.__TEST_ERROR__ ? { message: '__TEST_ERROR__', details: {} } : null,
      res,
    )
  }
} else if (conf.forceLongpolling) {
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
          callback(userErr || err)
          return
        }
        log('res', res.body ? res.body.response : res)
        callback(null, res.body && res.body.response)
      })
  }
} else {
  rpc = (data, callback) => {
    client().call(
      `${data.ns}/${data.action}`,
      ...(data.args || []),
      (err, res) => {
        if (err) log('err', err, err.details)
        else log('res', res)
        callback(err, res)
      },
    )
  }
}

export default function(data, ...args) {
  let options = args[0]
  let callback = args[1]
  if (typeof options === 'function') {
    callback = options
    options = null
  }
  if (!options) options = {}

  const fData = toSnake(data)

  log('req', fData)

  return new Promise((resolve, reject) => {
    rpc(fData, (err, res) => {
      // eslint-disable-next-line no-param-reassign
      if (err && !err.message) err.message = 'Unexpected Server Error'
      const fRes = res && options.camelize ? toCamel(res) : res
      if (err) reject(err)
      else resolve(fRes)
      if (callback) callback(err, fRes)
    })
  })
}
