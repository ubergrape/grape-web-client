'use strict';

exports.__esModule = true;
exports['default'] = toData;
var prefix = 'data:image/svg+xml;base64,';

function toData(svg) {
  return prefix + btoa(svg);
}

module.exports = exports['default'];