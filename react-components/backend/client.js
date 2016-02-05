import conf from 'conf'
import LpioClient from 'lpio-client'
import WampClient from './WampClient'

export const type = conf.forceLongpolling ? 'lp' : 'ws'

let client
if (type === 'lp') client = new LpioClient({url: conf.pubsubUrl})
if (type === 'ws') client = new WampClient()

export default client
