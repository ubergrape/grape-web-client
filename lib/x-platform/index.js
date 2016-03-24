'use strict';

exports.__esModule = true;
exports.createNotification = createNotification;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _web = require('./web');

var web = _interopRequireWildcard(_web);

var _electron = require('./electron');

var electron = _interopRequireWildcard(_electron);

var _macGap = require('./macGap');

var macGap = _interopRequireWildcard(_macGap);

var implementation = web;
var process = window.process;
var MacGap = window.MacGap;

if (process && process.versions && process.versions.electron) {
  implementation = electron;
  implementation.init();
} else if (MacGap) {
  implementation = macGap;
}

function createNotification() {
  if (implementation.createNotification) {
    var _implementation;

    return (_implementation = implementation).createNotification.apply(_implementation, arguments);
  }
}

function openUrl() {
  var _implementation2;

  if (implementation.openUrl) return (_implementation2 = implementation).openUrl.apply(_implementation2, arguments);
}

function addBadge() {
  var _implementation3;

  if (implementation.addBadge) return (_implementation3 = implementation).addBadge.apply(_implementation3, arguments);
}

function removeBadge() {
  var _implementation4;

  if (implementation.removeBadge) return (_implementation4 = implementation).removeBadge.apply(_implementation4, arguments);
}