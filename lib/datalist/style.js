'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _grapeJssUtils = require('grape-jss-utils');

var _grapeJssUtils2 = _interopRequireDefault(_grapeJssUtils);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var item = {
  padding: '5px 7px',
  color: _grapeThemeDistBaseColors2['default'].grapeTypo,
  cursor: 'pointer'
};

exports['default'] = {
  container: {
    background: _grapeThemeDistBaseColors2['default'].white,
    border: '1px solid ' + _grapeThemeDistBaseColors2['default'].gainsboroLight,
    boxShadow: '0px 3px 4px 0 ' + _color2['default'](_grapeThemeDistBaseColors2['default'].grapeTypo).alpha(0.5).rgbaString(),
    overflow: 'auto'
  },
  item: _extends({}, item, _grapeJssUtils2['default'].ellipsis, _grapeThemeDistFonts2['default'].normal),
  itemFocused: _extends({}, item, _grapeJssUtils2['default'].ellipsis, _grapeThemeDistFonts2['default'].normal, {
    color: _grapeThemeDistBaseColors2['default'].white,
    background: _grapeThemeDistBaseColors2['default'].grapeLight
  }),
  icon: {
    display: 'inline-block',
    lineHeight: 0,
    verticalAlign: 'middle',
    marginTop: -3
  },
  name: {
    lineHeight: 1,
    marginLeft: 5
  }
};
module.exports = exports['default'];