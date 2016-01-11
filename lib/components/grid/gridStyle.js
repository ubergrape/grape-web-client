'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

exports['default'] = {
  grid: {
    // Also important for objects offset calculation and view port management.
    position: 'relative',
    background: _grapeThemeDistBaseColors2['default'].white
  }
};
module.exports = exports['default'];