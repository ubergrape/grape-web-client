// extends pgherveou/store component with
// a check functionality that warns
// if a prefix is already in use

let Store = require('store')

let prefixes = []

module.exports = Store

let protoPrefix = Store.prefix

Store.prefix = function (prefix) {
  check(prefix)
  // the . is for highlighting the prefix
  return protoPrefix.call(this, prefix + '.')
}

function check(prefix) {
  if (prefixes.indexOf(prefix) > -1) console.warn('Prefix ' + prefix + ' is already taken')
  prefixes.push(prefix)
}