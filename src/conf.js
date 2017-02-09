const merge = require('lodash/object/merge')

function Config(conf) {
  this.isLoaded = false
  this.init()
  if (conf) this.setup(conf)
}

/**
 * Setup defaults.
 */
Config.prototype.init = function () {
  if (!this.forceLongpolling && localStorage.forceLongpolling) {
    this.forceLongpolling = true
  }

  // TODO remove this in #4066
  this.newHistory = true

  this.constants = {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2
    }
  }

  this.user = {
    languageCode: 'en'
  }
  this.organization = {}
  this.server = {
    loginPath: '/accounts/login',
    host: localStorage.host || window.location.host,
    protocol: window.location.protocol
  }
  const wsProtocol = this.server.protocol === 'http:' ? 'ws:' : 'wss:'
  this.server.wsUrl = `${wsProtocol}//${this.server.host}/ws`
}

Config.prototype.setup = function (conf) {
  merge(this, conf)
  this.isLoaded = true
}

module.exports = new Config(window.CHATGRAPE_CONFIG)
