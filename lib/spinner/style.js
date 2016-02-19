'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

exports['default'] = {
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'no-repeat center',
    backgroundSize: 'contain'
  },
  overlay: {
    backgroundColor: _color2['default'](_grapeThemeDistBaseColors2['default'].white).alpha(0.7).rgbaString()
  }
};
module.exports = exports['default'];