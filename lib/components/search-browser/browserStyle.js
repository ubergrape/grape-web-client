'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeWebLibSvgIconsGetColored = require('grape-web/lib/svg-icons/getColored');

var _grapeWebLibSvgIconsGetColored2 = _interopRequireDefault(_grapeWebLibSvgIconsGetColored);

var _browserStyle = require('../browser/style');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

var iconSize = 22;
var magnifierIcon = _grapeWebLibSvgIconsGetColored2['default']({ name: 'magnifier', color: _grapeThemeDistBaseColors2['default'].blue });

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
    height: iconSize,
    width: iconSize,
    background: 'no-repeat url(\'' + magnifierIcon + '\')',
    backgroundSize: 'contain',
    alignSelf: 'center',
    marginLeft: 20
  }
});
module.exports = exports['default'];