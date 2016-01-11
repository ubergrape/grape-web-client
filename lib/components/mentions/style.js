'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

exports['default'] = {
  icon: {
    '&:before': {
      color: _grapeThemeDistBaseColors2['default'].gainsboroDark,
      fontSize: '1.6em'
    }
  }
};
module.exports = exports['default'];