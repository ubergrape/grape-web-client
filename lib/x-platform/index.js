'use strict';

exports.__esModule = true;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;
var electron = undefined;
if (require) electron = require('electron');

/**
 * Open a url in browser and MacGap.
 */

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
  if (window.MacGap) {
    window.MacGap.Dock.addBadge(text);
    return;
  }
  if (electron) {
    electron.ipcRenderer.send('addBadge', text);
    return;
  }
}

/**
 * Removes the doc icon badge.
 */

function removeBadge() {
  if (window.MacGap) {
    window.MacGap.Dock.removeBadge();
  }
  if (electron) {
    electron.ipcRenderer.send('removeBadge');
  }
}