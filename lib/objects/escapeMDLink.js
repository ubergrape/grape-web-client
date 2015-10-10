'use strict';

exports.__esModule = true;
exports['default'] = escapeMDLink;
var regExp = /[()]/g;

/**
 * Escape markdown link target.
 */

function escapeMDLink(link) {
  return link.replace(regExp, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

module.exports = exports['default'];