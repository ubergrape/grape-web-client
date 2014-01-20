/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Wamp = require('wamp1');
var WebSocketBuffering = require('websocket-buffering');
var Adapter = require('./adapter');

// TODO: need some way to configure the settings in both node and browser
var HOST = 'ws://' + (typeof location === 'undefined' ? 'localhost:8080' : location.host);

var ws = new WebSocketBuffering(HOST);
var wamp = exports.wamp = new Wamp(ws);

// expose models with transparent adapter over wamp
Adapter.channel = wamp;
var models = exports.models = {};
models.Room = require('./models/room');

