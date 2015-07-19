'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

exports['default'] = {
  header: _extends({}, _grapeThemeDistFonts2['default'].small, {
    background: _grapeThemeDistBaseColors2['default'].silverLight,
    borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
    padding: '5px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark
  })
};
module.exports = exports['default'];