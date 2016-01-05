'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeWebLibSvgIconsData = require('grape-web/lib/svg-icons/data');

var icons = _interopRequireWildcard(_grapeWebLibSvgIconsData);

var _browserStyle = require('../browser/style');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

var iconSize = 22;

exports['default'] = _extends({}, _browserStyle2['default'], {
  input: _extends({}, _grapeThemeDistFonts2['default'].biggest, {
    color: _grapeThemeDistBaseColors2['default'].grapeTypo,
    padding: 15,
    border: 'none !important',
    outline: 'none',
    flex: 1
  }),
  inputContainer: {
    display: 'flex'
  },
  searchIcon: {
    display: 'inline-block',
    height: iconSize,
    width: iconSize,
    background: 'no-repeat url(\'' + icons.magnifier + '\')',
    backgroundSize: 'contain',
    alignSelf: 'center',
    marginLeft: 20
  }
});
module.exports = exports['default'];