var assign = require('lodash/object/assign')

function Config(conf) {
  this.isInitialized = false
  this.isLoaded = false
  if (conf) this.setup(conf)
  this.init()
}

Config.prototype.init = function(conf) {
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

  this.isInitialized = true

  return this
}

Config.prototype.setup = function(conf) {
  assign(this, conf)
  this.isLoaded = true
}

module.exports = new Config(window.CHATGRAPE_CONFIG)
