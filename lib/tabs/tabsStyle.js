'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

exports['default'] = {
  tabs: {
    display: 'block',
    padding: '0 0 2px 0',
    whiteSpace: 'nowrap',
    backgroundColor: _grapeThemeDistBaseColors2['default'].white,
    boxShadow: 'inset 0 -2px 0 ' + _grapeThemeDistBaseColors2['default'].silverDark,
    overflow: 'hidden'
  },
  inner: {
    display: 'inline-block',
    padding: 0
  }
};
module.exports = exports['default'];