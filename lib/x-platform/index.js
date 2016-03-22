'use strict';

exports.__esModule = true;
exports.createNotification = createNotification;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constants = require('./constants');

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _lodashNumberRandom = require('lodash/number/random');

var _lodashNumberRandom2 = _interopRequireDefault(_lodashNumberRandom);

// Electron brings own require to window
var electron = undefined;
var remote = undefined;
if (window.require) {
  electron = require('electron');
  remote = require('remote');
}

var macGap = window.MacGap;

function createNotification(_ref) {
  var title = _ref.title;
  var content = _ref.content;
  var icon = _ref.icon;
  var callback = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityNoop2['default'] : arguments[1];

  if (macGap) {
    macGap.notify({
      title: title,
      content: content,
      sound: false
    });
    return;
  }

  // This will show Windows Tray Balllon in Windows < 10.
  if (electron && !remote.getGlobal('isNotificationSupported')) {
    var _ret = (function () {
      var id = _lodashNumberRandom2['default'](10000);

      electron.ipcRenderer.once(id, function () {
        return callback();
      });

      electron.ipcRenderer.send('showNotification', {
        id: id,
        title: title,
        message: content
      });
      setTimeout(function () {
        electron.ipcRenderer.removeAllListeners(id);
      }, _constants.notificationClickTimeout);
      return {
        v: undefined
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  }

  // This will show native HTML Notification.
  var notify = window.notify;

  if (notify) {
    (function () {
      notify.config(_constants.notificationsConfig);
      var notification = notify.createNotification(title, {
        icon: icon,
        tag: title,
        body: content,
        onclick: function onclick() {
          callback();
          window.focus();
          notification.close();
        }
      });
    })();
  }
}

/**
 * Open a url in browser, MacGap or Electron.
 * Electron handle url open on main process side.
 */

function openUrl(url) {
  var _blank = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  if (macGap) return macGap.openURL(url);
  if (_blank) return window.open(url);
  window.location.href = url;
}

/**
 * Renders
 * - the doc icon badge (MacGap, Electron)
 * - highlight OSX Tray (Electron)
 * - highlight Windows Taskbar Icon (Electron)
 */

function addBadge(text) {
  if (macGap) {
    macGap.Dock.addBadge(text);
    return;
  }
  if (electron) {
    electron.ipcRenderer.send('addBadge', text);
    return;
  }
}

/**
 * Removes
 * - the doc icon badge (MacGap, Electron)
 * - highlight OSX Tray (Electron)
 * - highlight Windows Taskbar Icon (Electron)
 */

function removeBadge() {
  if (macGap) {
    macGap.Dock.removeBadge();
    return;
  }
  if (electron) {
    electron.ipcRenderer.send('removeBadge');
    return;
  }
}