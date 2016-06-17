import './templates'
import './stylus/app.styl'
import 'meyer-reset/index.css'
import 'normalize.css/normalize.css'
import 'notification/notification.css'
import 'scrollbars/scrollbars.css'
import 'dialog-component/dialog.css'
import 'overlay-component/overlay.css'
import 'image-zoom/dist/imagezoom.css'
import 'intro.js/introjs.css'
import 'drop-anywhere/drop-anywhere.css'
import 'jh3y-resizable/resizable.css'
import 'grape-js-emoji/emoji.css'

import Api from './api'
import Ui from './ui'
import initBroker from './init-broker'
import conf from 'conf'
import rpc from '../utils/backend/rpc'

export default function init() {
  // TODO maybe use pick
  // initialize the UI and add it to the DOM
  window.ui = new Ui(conf)
  document.body.appendChild(window.ui.el)

  // initialize the App
  window.api = new Api()

  // hook up UI to App
  initBroker(window.ui, window.api)

  window.api.connect()

  // This is an official debugging tool for our backend devs.
  window.rpc = rpc
}
