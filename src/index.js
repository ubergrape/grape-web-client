import 'es6-promise'
import 'array.from'
import 'custom-event-polyfill'
import 'document-register-element'
import 'reactive-elements'

import conf from 'conf'
import initApp from './app'
import initLegacy from './legacy'
import {loadConfig} from './utils/backend/api'

const log = console.log.bind(console) // eslint-disable-line no-console

function ensureConf() {
  function init() {
    initApp()
    initLegacy()
  }

  // Remove second check when new config is merged to staging.
  // It checks wether we have the old config.
  // Temporarily if document contains the old config, we will load the config
  // from the endpoint.
  if (conf.isLoaded && !conf.organizationID) return init()

  loadConfig({host: conf.server.host})
    .then(res => {
      conf.setup(res)
      init()
    })
    .catch(log)
}

ensureConf()
