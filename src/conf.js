const merge = require('lodash/object/merge')

const host = localStorage.host || window.location.host

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
  embed = Boolean(localStorage.embed)
  channelId = localStorage.channelId ? Number(localStorage.channelId) : null
  forceLongpolling = Boolean(localStorage.forceLongpolling)
  server = {
    host,
    protocol: 'https:',
    wsUrl: `wss://${host}/ws`
  }

  setup(options) {
    merge(this, options)
  }
}

export default new Config()
