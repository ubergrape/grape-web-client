'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grapeThemeDistBaseColors = require('grape-theme/dist/base-colors');

var _grapeThemeDistBaseColors2 = _interopRequireDefault(_grapeThemeDistBaseColors);

var _grapeThemeDistFonts = require('grape-theme/dist/fonts');

var _grapeThemeDistFonts2 = _interopRequireDefault(_grapeThemeDistFonts);

var info = {
  overflow: 'auto',
  '& h2': {
    extend: _grapeThemeDistFonts2['default'].big,
    margin: 0
  },
  '& p': {
    extend: _grapeThemeDistFonts2['default'].normal,
    margin: _grapeThemeDistFonts2['default'].normal.fontSize + ' 0'
  }
};

var header = {
  background: 'center no-repeat',
  backgroundSize: 'auto 80%'
};

exports['default'] = {
  infoOk: {
    extend: info,
    background: _grapeThemeDistBaseColors2['default'].grassLightest
  },
  infoNok: {
    extend: info,
    background: _grapeThemeDistBaseColors2['default'].sandLighter
  },
  headerOk: {
    extend: header,
    backgroundColor: _grapeThemeDistBaseColors2['default'].grassLighter
  },
  headerNok: {
    extend: header,
    backgroundColor: _grapeThemeDistBaseColors2['default'].sandLight
  },
  body: {
    padding: 15
  },
  button: {
    width: '100%'
  }
};
module.exports = exports['default'];