'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashStringTemplate = require('lodash/string/template');

var _lodashStringTemplate2 = _interopRequireDefault(_lodashStringTemplate);

// TODO Stop using global classes
exports['default'] = _lodashStringTemplate2['default']('\n  <a\n    href="<%- url %>"\n    class="ac animate <%- service %> <%- type %>"\n    data-object="<%- str %>"\n    tabindex="-1">\n    <%- content %>\n  </a>\n');
module.exports = exports['default'];