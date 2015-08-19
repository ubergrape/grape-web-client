'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

exports['default'] = {
  editable: {
    display: 'inline-block',
    width: '100%',
    height: '100%',
    lineHeight: 1.5,
    padding: 8,
    outline: 'none',
    '& p': {
      margin: 0
    }
  },
  placeholder: {
    '& p': {
      // Hide empty paragraphs when showing placeholder to avoid height jumps.
      fontSize: 0
    },
    '&:before': {
      content: 'attr(data-placeholder)',
      color: _grapeThemeDistBaseColors2['default'].gainsboroLight
    }
  }
};
module.exports = exports['default'];