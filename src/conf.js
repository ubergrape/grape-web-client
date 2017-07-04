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
  server = {
    loginPath: '/accounts/login',
    host: localStorage.host || window.location.host,
    protocol: window.location.protocol
  }

  constructor() {
    if (!this.embed && localStorage.embed) {
      this.embed = true
    }

    if (!this.forceLongpolling && localStorage.forceLongpolling) {
      this.forceLongpolling = true
    }

    const wsProtocol = this.server.protocol === 'http:' ? 'ws:' : 'wss:'
    this.server.wsUrl = `${wsProtocol}//${this.server.host}/ws`
  }

  setup(options) {
    merge(this, options)
  }
}

export default new Config()
