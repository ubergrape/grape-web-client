'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _searchBrowserBrowser = require('./search-browser/Browser');

var _searchBrowserBrowser2 = _interopRequireDefault(_searchBrowserBrowser);

var _emojiBrowserBrowser = require('./emoji-browser/Browser');

var _emojiBrowserBrowser2 = _interopRequireDefault(_emojiBrowserBrowser);

var _grapeInputInput = require('./grape-input/Input');

var _grapeInputInput2 = _interopRequireDefault(_grapeInputInput);

exports.SearchBrowser = _searchBrowserBrowser2['default'];
exports.EmojiBrowser = _emojiBrowserBrowser2['default'];
exports.GrapeInput = _grapeInputInput2['default'];

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', _searchBrowserBrowser2['default']);
  document.registerReact('grape-emoji-browser', _emojiBrowserBrowser2['default']);
  document.registerReact('grape-input', _grapeInputInput2['default']);
}