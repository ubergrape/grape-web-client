'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsSearchBrowserBrowser = require('./components/search-browser/Browser');

var _componentsSearchBrowserBrowser2 = _interopRequireDefault(_componentsSearchBrowserBrowser);

var _componentsEmojiBrowserBrowser = require('./components/emoji-browser/Browser');

var _componentsEmojiBrowserBrowser2 = _interopRequireDefault(_componentsEmojiBrowserBrowser);

var _componentsGrapeInputGrapeInput = require('./components/grape-input/GrapeInput');

var _componentsGrapeInputGrapeInput2 = _interopRequireDefault(_componentsGrapeInputGrapeInput);

// Register reactive elements.

require('reactive-elements');

exports.SearchBrowser = _componentsSearchBrowserBrowser2['default'];
exports.EmojiBrowser = _componentsEmojiBrowserBrowser2['default'];
exports.GrapeInput = _componentsGrapeInputGrapeInput2['default'];

document.registerReact('grape-search-browser', _componentsSearchBrowserBrowser2['default']);
document.registerReact('grape-emoji-browser', _componentsEmojiBrowserBrowser2['default']);
document.registerReact('grape-input', _componentsGrapeInputGrapeInput2['default']);