import conf from 'conf'
import LpioClient from 'lpio-client'
import WampClient from './WampClient'

export const connectionType = conf.forceLongpolling ? 'lp' : 'ws'

let client
if (connectionType === 'lp') client = new LpioClient({url: conf.pubsubUrl})
if (connectionType === 'ws') client = new WampClient()

export default client
