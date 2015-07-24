'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserSearchBrowser = require('./browser-search/Browser');

var _browserSearchBrowser2 = _interopRequireDefault(_browserSearchBrowser);

var _browserEmojiBrowser = require('./browser-emoji/Browser');

var _browserEmojiBrowser2 = _interopRequireDefault(_browserEmojiBrowser);

exports.SearchBrowser = _browserSearchBrowser2['default'];
exports.EmojiBrowser = _browserEmojiBrowser2['default'];

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', _browserSearchBrowser2['default']);
  document.registerReact('grape-emoji-browser', _browserEmojiBrowser2['default']);
}