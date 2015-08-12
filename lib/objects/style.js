'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _jss = require('../jss');

var INSERT_ANIMATION_DURATION = 200;

exports.INSERT_ANIMATION_DURATION = INSERT_ANIMATION_DURATION;
// TODO migrate this legacy code to pure jss.

var rules = {
  '.ac': {
    userSelect: 'none'
  },
  '.ac.animate:after': {
    content: '""',
    position: 'absolute',
    height: '80%',
    width: 0,
    top: '9%',
    left: 0,
    pointerEvents: 'none',
    animation: 'grape-object-insertion ' + INSERT_ANIMATION_DURATION + 'ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  '@keyframes grape-object-insertion': {
    from: {
      background: _grapeThemeDistBaseColors2['default'].aquaDark,
      width: '100%'
    },
    to: {
      width: 0,
      background: _color2['default'](_grapeThemeDistBaseColors2['default'].aquaDark).alpha(0.6).rgbaString()
    }
  }
};

var sheet = _jss.jss.createStyleSheet(rules, { named: false });
exports.sheet = sheet;