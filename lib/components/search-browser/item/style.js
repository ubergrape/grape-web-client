'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistWebColors = require('grape-theme/dist/web-colors');

var _grapeThemeDistWebColors2 = _interopRequireDefault(_grapeThemeDistWebColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var _grapeThemeDistSizes = require('grape-theme/dist/sizes');

var _grapeThemeDistSizes2 = _interopRequireDefault(_grapeThemeDistSizes);

var _grapeJssUtils = require('grape-jss-utils');

var _grapeJssUtils2 = _interopRequireDefault(_grapeJssUtils);

var container = {
  display: 'flex',
  position: 'relative',
  background: _grapeThemeDistBaseColors2['default'].white,
  color: _grapeThemeDistBaseColors2['default'].grapeTypo,
  cursor: 'pointer',
  userSelect: 'none',
  borderBottom: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark
};

exports.container = container;
var icon = {
  marginBottom: 2
};

var metaItem = _extends({}, _grapeThemeDistFonts2['default'].small, {
  display: 'block',
  marginLeft: 4,
  padding: '2px 6px',
  borderRadius: _grapeThemeDistSizes2['default'].borderRadius.small,
  border: '1px solid ' + _grapeThemeDistBaseColors2['default'].silverDark,
  backgroundColor: _grapeThemeDistBaseColors2['default'].silverLight,
  color: _grapeThemeDistBaseColors2['default'].gainsboroDark
});

var rules = {
  container: container,
  containerFocused: _extends({}, container, {
    color: _grapeThemeDistBaseColors2['default'].white,
    background: _grapeThemeDistWebColors2['default'].buttonBgDefault
  }),
  containerFocusedInactive: _extends({}, container, {
    color: _grapeThemeDistBaseColors2['default'].grayDark,
    background: _grapeThemeDistBaseColors2['default'].grayBlueLight
  }),
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 16px'
  },
  icon: _extends({}, icon, {
    color: _grapeThemeDistBaseColors2['default'].grayDark
  }),
  iconFocused: _extends({}, icon, {
    color: _grapeThemeDistBaseColors2['default'].grayDark
  }),
  nameContainer: {
    flex: 1,
    alignSelf: 'center',
    padding: '6px 0',
    minWidth: 1 // firefox 34+ flexbox bug workaround
  },
  name: _extends({}, _grapeThemeDistFonts2['default'].normal, _grapeJssUtils2['default'].ellipsis, {
    lineHeight: 1.2
  }),
  info: _extends({}, _grapeThemeDistFonts2['default'].smaller, _grapeJssUtils2['default'].ellipsis, {
    color: _grapeThemeDistBaseColors2['default'].grayLight,
    marginTop: 4,
    opacity: 0.5
  }),
  metaContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px'
  },
  metaItem: metaItem,
  metaItemFocused: _extends({}, metaItem, {
    color: _grapeThemeDistBaseColors2['default'].white,
    backgroundColor: _grapeThemeDistWebColors2['default'].buttonBgDefault
  })
};
exports.rules = rules;