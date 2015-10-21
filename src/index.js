require('array.from')
require('custom-event-polyfill')
require('document-register-element')
require('reactive-elements')

require('./templates')

require('../stylus/app.styl')
require('meyer-reset/index.css')
require('normalize.css/normalize.css')
require('notification/notification.css')
require('scrollbars/scrollbars.css')
require('dialog-component/dialog.css')
require('dialog-component/node_modules/overlay-component/overlay.css')
require('image-zoom/dist/imagezoom.css')
require('image-zoom/node_modules/overlay/dist/overlay.css')
require('intro.js/introjs.css')
require('drop-anywhere/drop-anywhere.css')
require('jh3y-resizable/resizable.css')
require('js-emoji/emoji.css')

let API = require('./api')
let UI = require('./ui')
let initBroker = require('./init-broker')
let conf = require('conf')

// TODO maybe use pick
// initialize the UI and add it to the DOM
window.ui = new UI(conf)
document.body.appendChild(window.ui.el)

// initialize the App
window.api = new API()

// hook up UI to App
initBroker(window.ui, window.api)

// and connect to the server
// TODO: this might come directly from the backend at some point?
window.api.connect((location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws/')
