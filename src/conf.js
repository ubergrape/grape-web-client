import merge from 'lodash/merge'
import parseUrl from 'grape-web/lib/parse-url'

const parseServiceUrl = url => {
  const { protocol, host } = parseUrl(url)
  return {
    wsUrl: `${protocol === 'http:' ? 'ws' : 'wss'}://${host}/ws`,
    host,
  }
}

class Config {
  constants = {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2,
      ROLE_GUEST: 3,
      ROLE_INVITED: 5,
    },
  }
  user = {
    languageCode: 'en',
  }
  organization = {}
  forceLongpolling = false
  embed = null
  channelId = null
  server = {
    wsUrl: null,
    pubsubUrl: null,
    sentryJsDsn: null,
    serviceUrl: window.location.origin,
    host: null,
    uploadPath: null,
    staticPath: null,
    authToken: null,
  }
  container = '#grape-client'

  constructor() {
    this.setup()
  }

  transform() {
    Object.assign(this.server, parseServiceUrl(this.server.serviceUrl))
  }

  mergeFromLocalStorage() {
    if (localStorage.embed) this.embed = Boolean(localStorage.embed)
    if (localStorage.channelId) this.channelId = Number(localStorage.channelId)
    if (localStorage.forceLongpolling) {
      this.forceLongpolling = Boolean(localStorage.forceLongpolling)
    }
    if (localStorage.serviceUrl)
      this.server.serviceUrl = localStorage.serviceUrl
  }

  setup(conf) {
    merge(this, conf)
    this.mergeFromLocalStorage()
    this.transform()
  }
}

export default new Config()
