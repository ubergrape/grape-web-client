const BluebirdPromise = require('bluebird')

// For tests we need a synchronouse promises resolution.
BluebirdPromise.setScheduler(fn => fn())
window.Promise = BluebirdPromise

let context = require.context('./src', true, /tests/)
context.keys().forEach(context)
