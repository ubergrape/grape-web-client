/**
 * Escape markdown link target.
 */
'use strict';

exports.__esModule = true;
exports.encodeMDLink = encodeMDLink;
exports.getTrigger = getTrigger;

function encodeMDLink(link) {
  var regExp = /[()]/g;
  return link.replace(regExp, function (c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

/**
 * Get trigger string based on object type
 */

function getTrigger(type) {
  switch (type) {
    case 'user':
    case 'room':
      return '@';
    default:
      return '#';
  }
}