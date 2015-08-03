'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

exports['default'] = {
  detail: {
    flex: 1
  },
  header: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: _grapeThemeDistBaseColors2['default'].silverLight,
    borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark
  },
  icon: {
    height: 64,
    width: 64
  },
  body: {
    padding: 15
  },
  title: _extends({}, _grapeThemeDistFonts2['default'].big, {
    margin: 0
  }),
  subtitle: _extends({}, _grapeThemeDistFonts2['default'].normal, {
    margin: '5px 0',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark
  }),
  description: {
    margin: '0 0 10px 0'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: _grapeThemeDistBaseColors2['default'].silverLight
  },
  emptyNote: {
    marginTop: 16,
    width: '50%',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark,
    textAlign: 'center'
  },
  metaContainer: {
    borderTop: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark
  },
  metaRow: {
    display: 'flex',
    padding: '4px 0',
    borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark
  },
  metaLabel: {
    flex: '1 0 0%',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark
  },
  metaValue: {
    flex: '2 0 0%'
  }
};
module.exports = exports['default'];