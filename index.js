/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";
require('./stylus/app.styl');
require('./templates')
var App = require('cglib');
var UI = require('./browser');
var initBroker = require('init-broker');
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