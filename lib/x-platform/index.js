/**
 * Open a url in browser and MacGap.
 */
"use strict";

exports.__esModule = true;
exports.openUrl = openUrl;

function openUrl(url) {
  if (window.MacGap) {
    return window.MacGap.openURL(url);
  }

  window.open(url);
}