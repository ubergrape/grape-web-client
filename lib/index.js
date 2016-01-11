'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsSearchBrowserSearchBrowser = require('./components/search-browser/SearchBrowser');

var _componentsSearchBrowserSearchBrowser2 = _interopRequireDefault(_componentsSearchBrowserSearchBrowser);

var _componentsEmojiBrowserBrowser = require('./components/emoji-browser/Browser');

var _componentsEmojiBrowserBrowser2 = _interopRequireDefault(_componentsEmojiBrowserBrowser);

var _componentsGrapeInputGrapeInput = require('./components/grape-input/GrapeInput');

var _componentsGrapeInputGrapeInput2 = _interopRequireDefault(_componentsGrapeInputGrapeInput);

// Register reactive elements.

require('reactive-elements');

exports.SearchBrowser = _componentsSearchBrowserSearchBrowser2['default'];
exports.EmojiBrowser = _componentsEmojiBrowserBrowser2['default'];
exports.GrapeInput = _componentsGrapeInputGrapeInput2['default'];

document.registerReact('grape-search-browser', _componentsSearchBrowserSearchBrowser2['default']);
document.registerReact('grape-emoji-browser', _componentsEmojiBrowserBrowser2['default']);
document.registerReact('grape-input', _componentsGrapeInputGrapeInput2['default']);