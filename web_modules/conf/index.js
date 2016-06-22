var assign = require('lodash/object/assign')

function Config(conf) {
  this.isLoaded = false
  this.init()
  if (conf) this.setup(conf)
}

Config.prototype.init = function() {
  if (!this.forceLongpolling && localStorage.forceLongpolling) {
    this.forceLongpolling = true
  }

  if (localStorage.newHistory) {
    this.newHistory = true
  }

  this.host = localStorage.host || window.location.host
  const wsProtocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
  this.wsUrl = `${wsProtocol}://${this.host}/ws`

  this.constants = {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2
    }
  }

  this.server = {}
  this.user = {}
  this.organization = {}
}

Config.prototype.setup = function(conf) {
  assign(this, conf)
  this.isLoaded = true
}

module.exports = new Config(window.CHATGRAPE_CONFIG)
