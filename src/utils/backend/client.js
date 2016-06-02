import conf from 'conf'
import LpioClient from 'lpio-client'
import WampClient from './WampClient'

export const type = conf.forceLongpolling ? 'lp' : 'ws'

let instance

export function create() {
  if (!instance) {
    if (type === 'lp') instance = new LpioClient({url: conf.pubsubUrl})
    if (type === 'ws') instance = new WampClient({url: conf.wsUrl})
  }
  return instance
}

export default function client() {
  return instance
}
