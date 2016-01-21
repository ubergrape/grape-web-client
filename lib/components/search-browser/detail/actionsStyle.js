'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistWebColors = require('grape-theme/dist/web-colors');

var _grapeThemeDistWebColors2 = _interopRequireDefault(_grapeThemeDistWebColors);

exports['default'] = {
  action: {
    display: 'flex',
    padding: '5px 15px',
    cursor: 'pointer',
    color: _grapeThemeDistBaseColors2['default'].grayBlueDark
  },
  actionFocused: {
    background: _grapeThemeDistWebColors2['default'].buttonBgDefault,
    color: _grapeThemeDistBaseColors2['default'].white
  },
  // When parent component is not focused, but action is.
  actionFocusedInactive: {
    background: _grapeThemeDistBaseColors2['default'].grayBlueLighter
  },
  icon: {
    flexShrink: 0,
    width: 16,
    height: 16,
    marginRight: 10,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    alignSelf: 'center'
  },
  text: {
    flex: 1
  }
};
module.exports = exports['default'];