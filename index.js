/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";
var style = require('!css!stylus!./stylus/app.styl');
var chatheader = require('!./jade-virtualdom-loader!./templates/chatheader.jade')
exports.App = require('cglib');
exports.UI = require('./browser');
exports.broker = require('./lib/broker');