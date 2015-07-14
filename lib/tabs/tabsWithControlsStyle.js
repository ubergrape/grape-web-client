'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _lodashObjectDefaults = require('lodash/object/defaults');

var _lodashObjectDefaults2 = _interopRequireDefault(_lodashObjectDefaults);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _tabStyle = require('./tabStyle');

var tabStyle = _interopRequireWildcard(_tabStyle);

var arrow = _lodashObjectDefaults2['default']({
  position: 'absolute',
  top: 0,
  padding: '0 12px',
  extend: _grapeThemeDistFonts2['default'].small,
  color: _color2['default'](_grapeThemeDistBaseColors2['default'].grapeTypo).alpha(0.3).rgbaString(),
  zIndex: 1,
  border: '0px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
  backgroundColor: _grapeThemeDistBaseColors2['default'].white,
  '&:hover': {
    color: _color2['default'](_grapeThemeDistBaseColors2['default'].grapeTypo).alpha(0.6).rgbaString()
  }
}, tabStyle.container);

exports['default'] = {
  controls: {
    position: 'relative',
    margin: 0,
    padding: 0
  },
  prevArrow: {
    extend: arrow,
    borderRightWidth: 1,
    left: 0
  },
  nextArrow: {
    extend: arrow,
    borderLeftWidth: 1,
    right: 0
  }
};
module.exports = exports['default'];