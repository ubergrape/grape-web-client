"use strict";

exports.__esModule = true;
exports.createNotification = createNotification;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;
var macGap = window.MacGap;

function createNotification(_ref) {
  var title = _ref.title;
  var content = _ref.content;

  macGap.notify({
    title: title,
    content: content,
    sound: false
  });
}

/**
 * Open an url.
 */

function openUrl(url) {
  return macGap.openURL(url);
}

/**
 * Renders the doc icon badge.
 */

function addBadge(text) {
  macGap.Dock.addBadge(text);
}

/**
 * Removes the doc icon badge.
 */

function removeBadge() {
  macGap.Dock.removeBadge();
}