'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _baseColors = require('./base-colors');

var _baseColors2 = _interopRequireDefault(_baseColors);

exports['default'] = {
  link: _baseColors2['default'].aquaLight,
  button: _baseColors2['default'].aquaLight,
  buttonBgDefault: '#503c50',
  buttonColorDefault: _baseColors2['default'].white,
  buttonBgPrimary: _baseColors2['default'].grassLight,
  buttonColorPrimary: (0, _color2['default'])(_baseColors2['default'].grassDark).darken(0.5).rgbaString(),
  alertInfo: _baseColors2['default'].aquaDark,
  alertSuccess: _baseColors2['default'].grassDark,
  alertWarning: _baseColors2['default'].gold,
  alertDanger: _baseColors2['default'].bittersweetDark,
  roomHeaderBackground: _baseColors2['default'].grapeDark,
  chatBackground: _baseColors2['default'].white,
  chatContent: _baseColors2['default'].silverLight,
  navigationBackground: _baseColors2['default'].silverLight,
  organisationBackground: _baseColors2['default'].grapeDark,
  searchHighlightColor: '#ffeead',
  sidebarBackground: '#503c50',
  sidebarButtonBackground: '#6e4b6e',
  sidebarGroupTitle: '#aa96aa'
};
module.exports = exports['default'];