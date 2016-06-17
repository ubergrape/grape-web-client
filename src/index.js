import 'es6-promise'
import 'array.from'
import 'custom-event-polyfill'
import 'document-register-element'
import 'reactive-elements'

import conf from 'conf'
import initApp from './app'
/*
import initLegacy from './legacy'
import {loadConfig} from './utils/backend/api'

function init() {
  initApp()
  initLegacy()
}

if (conf.isLoaded) {
  init()
} else {
  loadConfig({host: conf.host})
    .then(res => {
      console.log(res)
      conf.setup(res)
      //init()
    })
    .catch(err => console.log(err))
}

*/
