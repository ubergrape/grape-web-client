'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var TAB_ICON = {
  width: '1em',
  height: '1em',
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
  itemFocused: {
    extend: item,
    background: _grapeThemeDistBaseColors2['default'].gainsboroLight,
    borderRadius: 3
  }
};
exports.rules = rules;