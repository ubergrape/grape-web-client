'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var columnMarginRight = 10;
var leftColumnWidth = 60;

exports['default'] = {
  detail: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // Workaround, can't get height to fill the sidebar.
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  content: {
    flex: 1,
    overflow: 'auto'
  },
  previewContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: _grapeThemeDistBaseColors2['default'].silverLight,
    height: 128
  },
  article: {
    position: 'relative',
    display: 'flex',
    borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
    padding: 20,
    paddingBottom: 10
  },
  articleIcon: {
    height: leftColumnWidth,
    width: leftColumnWidth,
    flexShrink: 0,
    marginRight: columnMarginRight
  },
  articleBody: {
    flex: 1
  },
  title: _extends({}, _grapeThemeDistFonts2['default'].big, {
    margin: 0
  }),
  subtitle: _extends({}, _grapeThemeDistFonts2['default'].normal, {
    margin: '5px 0',
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark
  }),
  description: _extends({}, _grapeThemeDistFonts2['default'].small, {
    margin: '0 0 10px 0'
  }),
  metaContainer: {
    padding: 20,
    paddingTop: 10
  },
  metaRow: {
    display: 'flex',
    padding: '2px 0'
  },
  metaLabel: _extends({}, _grapeThemeDistFonts2['default'].small, {
    color: _grapeThemeDistBaseColors2['default'].gainsboroDark,
    textAlign: 'right',
    marginRight: columnMarginRight,
    width: leftColumnWidth
  }),
  metaValue: _extends({}, _grapeThemeDistFonts2['default'].small, {
    flex: '2 0 0%'
  })
};
module.exports = exports['default'];