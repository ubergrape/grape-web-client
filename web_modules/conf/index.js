var assign = require('lodash/object/assign')

var conf = module.exports = window.CHATGRAPE_CONFIG || {}

if (!conf.forceLongpolling && localStorage.forceLongpolling) {
  conf.forceLongpolling = true
}

if (localStorage.newHistory) {
  conf.newHistory = true
}

conf.setup = function(obj) {
  assign(conf, obj)
}
