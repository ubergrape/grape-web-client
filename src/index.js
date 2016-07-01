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

  if (conf.isLoaded) return init()

  loadConfig()
    .then(res => {
      conf.setup(res)
      init()
    })
    .catch(log)
}

ensureConf()
