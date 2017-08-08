import merge from 'lodash/object/merge'

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
  container = null
  embed = null
  channelId = null
  server = {
    host: null,
    protocol: 'https:',
    wsUrl: null,
    sentryJsDsn: null
  }
  container: '#grape-client'

  constructor() {
    this.setup({
      server: {
        host: localStorage.host || window.location.host
      },
      embed: Boolean(localStorage.embed),
      channelId: localStorage.channelId ? Number(localStorage.channelId) : null,
      forceLongpolling: Boolean(localStorage.forceLongpolling)
    })
  }

  setup(conf) {
    merge(this, {
      ...conf,
      server: {
        ...conf.server,
        wsUrl: `wss://${conf.server.host || this.server.host}/ws`
      }
    })
  }
}

export default new Config()
