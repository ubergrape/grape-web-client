'use strict';

exports.__esModule = true;
exports['default'] = toData;
var defaultEncoding = 'base64';
var prefix = 'data:image/svg+xml;';

function toData(svg) {
  var encoding = arguments.length <= 1 || arguments[1] === undefined ? defaultEncoding : arguments[1];

  var encoded = svg;
  if (encoding === 'base64') encoded = btoa(svg);
  return prefix + encoding + ',' + encoded;
}

module.exports = exports['default'];