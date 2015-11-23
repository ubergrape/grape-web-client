import conf from 'conf'
import Client from 'lpio-client'

export default new Client({url: conf.pubsubUrl})
