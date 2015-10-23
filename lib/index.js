'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _searchBrowserBrowser = require('./search-browser/Browser');

var _searchBrowserBrowser2 = _interopRequireDefault(_searchBrowserBrowser);

var _searchModalBrowserSearchModalBrowser = require('./search-modal-browser/SearchModalBrowser');

var _searchModalBrowserSearchModalBrowser2 = _interopRequireDefault(_searchModalBrowserSearchModalBrowser);

var _emojiBrowserBrowser = require('./emoji-browser/Browser');

var _emojiBrowserBrowser2 = _interopRequireDefault(_emojiBrowserBrowser);

var _grapeInputGrapeInput = require('./grape-input/GrapeInput');

var _grapeInputGrapeInput2 = _interopRequireDefault(_grapeInputGrapeInput);

// Register reactive element.

require('reactive-elements');

exports.SearchBrowser = _searchBrowserBrowser2['default'];
exports.SearchModalBrowser = _searchModalBrowserSearchModalBrowser2['default'];
exports.EmojiBrowser = _emojiBrowserBrowser2['default'];
exports.GrapeInput = _grapeInputGrapeInput2['default'];

document.registerReact('grape-search-browser', _searchBrowserBrowser2['default']);
document.registerReact('grape-search-modal-browser', _searchModalBrowserSearchModalBrowser2['default']);
document.registerReact('grape-emoji-browser', _emojiBrowserBrowser2['default']);
document.registerReact('grape-input', _grapeInputGrapeInput2['default']);