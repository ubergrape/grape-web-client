const merge = require('lodash/object/merge')


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
  embed = false
  forceLongpolling = false
  channel = null

  constructor() {
    if (!this.embed && localStorage.embed) {
      this.embed = true
    }

    if (!this.forceLongpolling && localStorage.forceLongpolling) {
      this.forceLongpolling = true
    }

    const host = localStorage.host || window.location.host
    this.server = {
      host,
      protocol: 'https:',
      wsUrl: `wss://${host}/ws`
    }
  }

  setup(options) {
    merge(this, options)
  }
}

export default new Config()
