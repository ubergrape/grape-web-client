'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var info = {
  overflow: 'auto',
  '& h2': _extends({}, _grapeThemeDistFonts2['default'].big, {
    margin: 0
  }),
  '& p': _extends({}, _grapeThemeDistFonts2['default'].normal, {
    margin: _grapeThemeDistFonts2['default'].normal.fontSize + ' 0'
  })
};

var header = {
  background: 'center no-repeat',
  backgroundSize: 'auto 80%'
};

exports['default'] = {
  infoOk: _extends({}, info, {
    background: _grapeThemeDistBaseColors2['default'].grassLightest
  }),
  infoNok: _extends({}, info, {
    background: _grapeThemeDistBaseColors2['default'].sandLighter
  }),
  headerOk: _extends({}, header, {
    backgroundColor: _grapeThemeDistBaseColors2['default'].grassLighter
  }),
  headerNok: _extends({}, header, {
    backgroundColor: _grapeThemeDistBaseColors2['default'].sandLight
  }),
  body: {
    padding: 15
  },
  button: {
    width: '100%'
  }
};
module.exports = exports['default'];