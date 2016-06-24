var merge = require('lodash/object/merge')

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

  this.server.host = localStorage.host || window.location.host
  var wsProtocol = window.location.protocol === 'http:' ? 'ws' : 'wss'
  this.server.wsUrl = wsProtocol + '://' + this.server.host + '/ws'
}

Config.prototype.setup = function(conf) {
  merge(this, conf)
  this.isLoaded = true
}

module.exports = new Config(window.CHATGRAPE_CONFIG)
