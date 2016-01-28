/**
 * Open a url in browser and MacGap.
 */
"use strict";

exports.__esModule = true;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;

function openUrl(url) {
  if (window.MacGap) {
    return window.MacGap.openURL(url);
  }

  window.open(url);
}

/**
 * Renders the doc icon badge.
 */

function addBadge(text) {
  if (!window.MacGap) return;
  window.MacGap.Dock.addBadge(text);
}

/**
 * Removes the doc icon badge.
 */

function removeBadge() {
  if (!window.MacGap) return;
  window.MacGap.Dock.removeBadge();
}