// Setup jss plugins.
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jss = require('jss');

var _jss2 = _interopRequireDefault(_jss);

var _jssExtend = require('jss-extend');

var _jssExtend2 = _interopRequireDefault(_jssExtend);

var _jssNested = require('jss-nested');

var _jssNested2 = _interopRequireDefault(_jssNested);

var _jssCamelCase = require('jss-camel-case');

var _jssCamelCase2 = _interopRequireDefault(_jssCamelCase);

var _jssPx = require('jss-px');

var _jssPx2 = _interopRequireDefault(_jssPx);

var _jssVendorPrefixer = require('jss-vendor-prefixer');

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

_jss2['default'].use(_jssExtend2['default']);
_jss2['default'].use(_jssNested2['default']);
_jss2['default'].use(_jssCamelCase2['default']);
_jss2['default'].use(_jssPx2['default']);
_jss2['default'].use(_jssVendorPrefixer2['default']);