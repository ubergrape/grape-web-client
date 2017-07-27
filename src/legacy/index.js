import './stylus/app.styl'
import 'meyer-reset/index.css'
import 'normalize.css/normalize.css'
import 'grape-js-emoji/emoji.css'

import Api from './api'
import Ui from './ui'
import initBroker from './init-broker'
import conf from '../conf'
import rpc from '../utils/backend/rpc'
import * as legacyTranslataions from '../i18n/legacy'

export default function init() {
  // Initialize the legacy UI and add it to the DOM.
  window.ui = new Ui({
    messages: legacyTranslataions[conf.user.languageCode],
    languageCode: conf.user.languageCode,
    organizationId: conf.organization.id
  })

  // initialize the App
  window.api = new Api()

  // hook up UI to App
  initBroker(window.ui, window.api)

  window.api.connect()

  // This is an official debugging tool for our backend devs.
  window.rpc = rpc
}
