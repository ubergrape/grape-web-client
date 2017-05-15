import 'es6-promise'
import 'array.from'
import 'custom-event-polyfill'
import 'innersvg-polyfill'
import 'document-register-element'
import 'reactive-elements'
import 'intl'

import conf from './conf'
import {
  init as initApp,
  render as renderApp,
  renderSheetsInsertionPoints
} from './app'
import initLegacy from './legacy'
import {loadConfig} from './utils/backend/api'

const log = console.log.bind(console) // eslint-disable-line no-console

function ensureConf() {
  function init() {
    initApp()
    renderSheetsInsertionPoints()
    initLegacy()
    renderApp()
  }

  if (conf.isLoaded) {
    init()
    return
  }

  loadConfig()
    .then((res) => {
      conf.setup(res)
      init()
    })
    .catch(log)
}

ensureConf()
