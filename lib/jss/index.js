// Setup jss plugins.
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jss = require('jss');

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _jssNested = require('jss-nested');

var _jssNested2 = _interopRequireDefault(_jssNested);

var _jssCamelCase = require('jss-camel-case');

var _jssCamelCase2 = _interopRequireDefault(_jssCamelCase);

var _jssDefaultUnit = require('jss-default-unit');

var _jssDefaultUnit2 = _interopRequireDefault(_jssDefaultUnit);

var _jssVendorPrefixer = require('jss-vendor-prefixer');

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

var jss = _jss.create();
exports.jss = jss;
var useSheet = _reactJss2['default'](jss);

exports.useSheet = useSheet;
jss.use(_jssNested2['default']());
jss.use(_jssCamelCase2['default']());
jss.use(_jssDefaultUnit2['default']());
jss.use(_jssVendorPrefixer2['default']());