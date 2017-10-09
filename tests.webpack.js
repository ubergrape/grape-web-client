const BluebirdPromise = require('bluebird')

// For tests we need a synchronouse promises resolution.
BluebirdPromise.setScheduler(fn => fn())
window.Promise = BluebirdPromise

//const {SynchronousPromise} = require('synchronous-promise')
//window.Promise = SynchronousPromise

//const mockPromises = require('mock-promises')
//mockPromises.install(Promise)

let context = require.context('./src', true, /tests/)
context.keys().forEach(context)
