'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var text = {
  extend: _grapeThemeDistFonts2['default'].small,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

exports.text = text;
var amount = {
  letterSpacing: 0,
  fontWeight: 'normal',
  marginLeft: 4,
  opacity: 0.75
};

exports.amount = amount;
var container = {
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 12px',
  listStyleType: 'none',
  cursor: 'pointer',
  height: 32,
  color: _color2['default'](_grapeThemeDistBaseColors2['default'].grapeTypo).alpha(0.7).rgbaString(),
  userSelect: 'none'
};

exports.container = container;
var rules = {
  container: {
    extend: container,
    '&:hover': {
      color: _grapeThemeDistBaseColors2['default'].grapeTypo
    }
  },
  containerSelected: {
    extend: container,
    color: _grapeThemeDistBaseColors2['default'].grapeTypo,
    boxShadow: '0 2px 0 ' + _grapeThemeDistBaseColors2['default'].grapeLight
  },
  text: text,
  amount: amount
};
exports.rules = rules;