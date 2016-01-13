'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var TAB_ICON = {
  width: '1.539em',
  height: '1.539em',
  marginRight: 5
};

exports.TAB_ICON = TAB_ICON;
var item = {
  display: 'inline-block',
  position: 'relative',
  padding: '6px 7px',
  cursor: 'pointer'
};

var rules = {
  item: item,
  itemFocused: _extends({}, item, {
    background: _grapeThemeDistBaseColors2['default'].gainsboroLight,
    borderRadius: 3
  })
};
exports.rules = rules;