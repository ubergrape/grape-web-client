'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _grapeThemeDistSizes = require('grape-theme/dist/sizes');

var _grapeThemeDistSizes2 = _interopRequireDefault(_grapeThemeDistSizes);

exports['default'] = {
  button: _extends({}, _grapeThemeDistFonts2['default'].normal, {
    borderRadius: _grapeThemeDistSizes2['default'].borderRadius.small,
    background: _grapeThemeDistBaseColors2['default'].grapeDark,
    border: 'none',
    color: _grapeThemeDistBaseColors2['default'].white,
    padding: '5px 10px',
    cursor: 'pointer',
    outline: 'none'
  })
};
module.exports = exports['default'];