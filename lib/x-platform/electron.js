'use strict';

exports.__esModule = true;
exports.createNotification = createNotification;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _lodashNumberRandom = require('lodash/number/random');

var _lodashNumberRandom2 = _interopRequireDefault(_lodashNumberRandom);

var _web = require('./web');

// Electron implements require on window.
var electron = undefined;
var remote = undefined;
if (window.require) {
  electron = require('electron');
  remote = require('remote');
}

var notificationClickTimeout = 20000;

function createNotification(options) {
  var callback = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityNoop2['default'] : arguments[1];

  // This will show native HTML Notification.
  if (remote.getGlobal('isNotificationSupported')) {
    _web.createNotification(options, callback);
    return;
  }

  var event = _lodashNumberRandom2['default'](10000);
  var title = options.title;
  var content = options.content;

  electron.ipcRenderer.once(event, callback);

  // This will show Windows Tray Balllon in Windows < 10.
  electron.ipcRenderer.send('showNotification', {
    event: event,
    title: title,
    message: content
  });
  setTimeout(function () {
    electron.ipcRenderer.removeAllListeners(event);
  }, notificationClickTimeout);
}

/**
 * Electron implements the web api.
 */
exports.openUrl = _web.openUrl;

/**
 * Add badge will:
 * - render the doc icon badge
 * - highlight OSX Tray
 * - highlight Windows Taskbar Icon
 */

function addBadge(text) {
  electron.ipcRenderer.send('addBadge', text);
}

/**
 * Remove badge will:
 * - remove the doc icon badge
 * - remove OSX Tray highlighting
 * - remove Windows Taskbar Icon highlighting
 */

function removeBadge() {
  electron.ipcRenderer.send('removeBadge');
}