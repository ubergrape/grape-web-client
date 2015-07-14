'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

exports['default'] = {
  sidebar: {
    extend: _grapeThemeDistFonts2['default'].normal,
    color: _grapeThemeDistBaseColors2['default'].grapeTypo,
    borderLeft: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
    backgroundColor: _grapeThemeDistBaseColors2['default'].white
  }
};
module.exports = exports['default'];