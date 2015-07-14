'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

exports['default'] = {
  header: {
    extend: _grapeThemeDistFonts2['default'].small,
    background: _grapeThemeDistBaseColors2['default'].silverLight,
    borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
    padding: '5px 12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark
  }
};
module.exports = exports['default'];