'use strict';

exports.__esModule = true;
exports['default'] = encodeMDLink;
var regExp = /[()]/g;

/**
 * Escape markdown link target.
 */

function encodeMDLink(link) {
  return link.replace(regExp, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

module.exports = exports['default'];