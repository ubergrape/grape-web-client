import merge from 'lodash/object/merge'
import parseUrl from 'grape-web/lib/parse-url'

const parseServiceUrl = (url) => {
  const {protocol, hostname} = parseUrl(url)
  return {
    wsUrl: `${protocol === 'http:' ? 'ws' : 'wss'}://${hostname}/ws`,
    hostname
  }
}

class Config {
  constants = {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2
    }
  }
  user = {
    languageCode: 'en'
  }
  organization = {}
  forceLongpolling = false
  embed = null
  channelId = null
  server = {
    wsUrl: null,
    pubsubUrl: null,
    sentryJsDsn: null,
    serviceUrl: null,
    host: null,
    uploadPath: null,
    staticPath: null,
    authToken: null
  }
  container = '#grape-client'

  constructor() {
    this.setup({
      embed: Boolean(localStorage.embed),
      channelId: localStorage.channelId ? Number(localStorage.channelId) : null,
      forceLongpolling: Boolean(localStorage.forceLongpolling),
      server: {serviceUrl: location.origin}
    })
  }

  setup(conf) {
    merge(this, conf)
    if (conf.server && conf.server.serviceUrl) {
      Object.assign(this.server, parseServiceUrl(conf.server.serviceUrl))
    }
  }
}

export default new Config()
