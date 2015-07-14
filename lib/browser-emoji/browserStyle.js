'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _browserStyle = require('../browser/style');

var _browserStyle2 = _interopRequireDefault(_browserStyle);

exports['default'] = _extends({}, _browserStyle2['default'], {
  sectionContent: {
    margin: 5
  }
});
module.exports = exports['default'];