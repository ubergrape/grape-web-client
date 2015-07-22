/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

require('document-register-element');
require('reactive-elements');
require('../stylus/app.styl');
require('./templates');
require('../node_modules/meyer-reset/index.css');
require('../node_modules/normalize.css/normalize.css');
require('../node_modules/notification/notification.css');
require('../node_modules/scrollbars/scrollbars.css');
require('../node_modules/dialog-component/dialog.css');
require('../node_modules/dialog-component/node_modules/overlay-component/overlay.css')
require('../node_modules/image-zoom/dist/imagezoom.css');
require('../node_modules/image-zoom/node_modules/overlay/dist/overlay.css');
require('../node_modules/textcomplete/lib/index.css');
require('../node_modules/intro.js/introjs.css');
require('../node_modules/drop-anywhere/drop-anywhere.css');
require('../node_modules/jh3y-resizable/resizable.css');
require('../node_modules/js-emoji/emoji.css');

var App = require('cglib');
var UI = require('./browser');
var initBroker = require('./init-broker');
var conf = require('conf');

// TODO maybe use pick
// initialize the UI and add it to the DOM
window.ui = new UI(conf);
document.body.appendChild(ui.el);

// initialize the App
var app = new App();

// hook up UI to App
initBroker(ui, app);

// and connect to the server
// TODO: this might come directly from the backend at some point?
app.connect((location.protocol === 'http:' ? 'ws://' : 'wss://') + location.host + '/ws/');