'use strict';

exports.__esModule = true;
exports['default'] = toData;
var prefix = 'data:image/svg+xml;utf8,';

function toData(svg) {
  return prefix + svg;
}

module.exports = exports['default'];