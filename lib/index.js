'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserSearchBrowser = require('./browser-search/Browser');

var _browserSearchBrowser2 = _interopRequireDefault(_browserSearchBrowser);

var _browserEmojiBrowser = require('./browser-emoji/Browser');

var _browserEmojiBrowser2 = _interopRequireDefault(_browserEmojiBrowser);

exports.SearchBrowser = _browserSearchBrowser2['default'];
exports.EmojiBrowser = _browserEmojiBrowser2['default'];