'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _inputStyle = require('../input/style');

var _inputStyle2 = _interopRequireDefault(_inputStyle);

exports['default'] = {
  editable: _extends({}, _inputStyle2['default'].input, {
    lineHeight: 1.5,
    padding: 8,
    outline: 'none',
    '& p': {
      margin: 0
    }
  }),
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