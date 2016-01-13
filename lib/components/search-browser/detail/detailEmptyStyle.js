'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

exports['default'] = {
  empty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: _grapeThemeDistBaseColors2['default'].silverLight
  },
  note: {
    marginTop: 16,
    width: '50%',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark,
    textAlign: 'center'
  }
};
module.exports = exports['default'];