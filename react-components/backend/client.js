import conf from 'conf'
import LpioClient from 'lpio-client'
import WampClient from './WampClient'

let client

if (conf.forceLongpolling) client = new Client({url: conf.pubsubUrl})
else client = new WampClient()

export default client
