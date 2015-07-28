/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

require('document-register-element');
require('reactive-elements');

require('./templates');

require('../stylus/app.styl');
require('meyer-reset/index.css');
require('normalize.css/normalize.css');
require('notification/notification.css');
require('scrollbars/scrollbars.css');
require('dialog-component/dialog.css');
require('dialog-component/node_modules/overlay-component/overlay.css')
require('image-zoom/dist/imagezoom.css');
require('image-zoom/node_modules/overlay/dist/overlay.css');
require('textcomplete/lib/index.css');
require('intro.js/introjs.css');
require('drop-anywhere/drop-anywhere.css');
require('jh3y-resizable/resizable.css');
require('js-emoji/emoji.css');

var API = require('./api');
var UI = require('./ui');
var initBroker = require('./init-broker');
var conf = require('conf');

// TODO maybe use pick
// initialize the UI and add it to the DOM
window.ui = new UI(conf);
document.body.appendChild(ui.el);

// initialize the App
window.api = new API();

// hook up UI to App
initBroker(ui, api);

// and connect to the server
// TODO: this might come directly from the backend at some point?
api.connect((location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws/');