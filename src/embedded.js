// TODO start importing only modules we use, so that embedded chat gets smaller bundle.

require('./polyfills')
const api = require('./api')

module.exports = api
