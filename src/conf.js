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
  embed = null
  channelId = null
  server = {
    host: location.host,
    protocol: 'https:',
    wsUrl: null,
    sentryJsDsn: null
  }
  container = '#grape-client'

  constructor() {
    this.setup({
      embed: Boolean(localStorage.embed),
      channelId: localStorage.channelId ? Number(localStorage.channelId) : null,
      forceLongpolling: Boolean(localStorage.forceLongpolling)
    })
  }

  setup(conf) {
    merge(this, conf)
  }
}

export default new Config()
