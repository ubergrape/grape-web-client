'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var iconsWidth = 65;

exports['default'] = {
  wrapper: _extends({}, _grapeThemeDistFonts2['default'].normal, {
    fontFamily: 'Arial, Helvetica, sans-serif',
    lineHeight: '22px',
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 38,
    boxSizing: 'border-box',
    paddingRight: iconsWidth
  }),
  common: {
    overflow: 'hidden',
    minHeight: 38,
    boxSizing: 'border-box',
    padding: 9,
    textRendering: 'auto'
  },
  textarea: {
    position: 'relative',
    zIndex: 1,
    display: 'block',
    width: '100%',
    height: '100%',
    outline: 'none',
    background: 'transparent',
    border: 'none',
    color: _grapeThemeDistBaseColors2['default'].grapeDark,
    resize: 'none'
  },
  highlighter: {
    position: 'absolute',
    left: '0',
    top: '0',
    right: iconsWidth,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: 'transparent'
  },
  token: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: '0 -1px',
    padding: '2px 0',
    borderRadius: 3
  },
  // TODO: this copy/paste to be refactored after token design will be ready
  room: {
    border: '1px solid #e2c8f0',
    background: 'linear-gradient(0deg, #e2c8f0, #e6d0f2)'
  },
  user: {
    border: '1px solid #75c7e5',
    background: 'linear-gradient(0deg, #75c7e5, #83d3f0)'
  },
  search: {
    border: '1px solid #b8e7aa',
    background: 'linear-gradient(0deg, #b8e7aa, #c3ebb7)'
  },
  emoji: {
    border: '1px solid #fbd6d6',
    background: 'linear-gradient(0deg, #fbd6d6, #fbdddd)'
  }
};
module.exports = exports['default'];