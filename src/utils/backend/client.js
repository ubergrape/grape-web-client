import LpioClient from 'lpio-client'

import conf from '../../conf'
import WampClient from './WampClient'

export const type = conf.forceLongpolling ? 'lp' : 'ws'

let instance

export function create() {
  if (!instance) {
    if (type === 'lp') instance = new LpioClient({url: conf.server.pubsubUrl})
    if (type === 'ws') instance = new WampClient({url: conf.server.wsUrl})
  }
  return instance
}

export default function client() {
  return instance
}
