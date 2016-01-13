'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

exports['default'] = {
  sidebar: _extends({}, _grapeThemeDistFonts2['default'].normal, {
    color: _grapeThemeDistBaseColors2['default'].grapeTypo,
    borderLeft: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
    backgroundColor: _grapeThemeDistBaseColors2['default'].white,
    position: 'relative'
  })
};
module.exports = exports['default'];