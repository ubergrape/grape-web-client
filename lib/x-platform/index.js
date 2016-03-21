'use strict';

exports.__esModule = true;
exports.onElectron = onElectron;
exports.openUrl = openUrl;
exports.addBadge = addBadge;
exports.removeBadge = removeBadge;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('html5-desktop-notifications');

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

/**
 * Subscribe on Electron main process event.
 */

function onElectron(event, callback) {
  if (electron) {
    electron.ipcRenderer.on(event, callback);
    return true;
  }
  return false;
}

var Notifier = (function () {
  function Notifier() {
    var _this = this;

    _classCallCheck(this, Notifier);

    if (electron) {
      this.callbacks = {};
      onElectron('notificationClicked', function (e, id) {
        if (_this.callbacks[id]) _this.callbacks[id]();
      });
    }
  }

  /**
   * Open a url in browser, MacGap or Electron.
   * Electron handle url open on main process side.
   */

  Notifier.prototype.createNotification = function createNotification(_ref) {
    var title = _ref.title;
    var content = _ref.content;
    var icon = _ref.icon;
    var slug = _ref.slug;
    var callback = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityNoop2['default'] : arguments[1];

    if (macGap) {
      macGap.notify({
        title: title,
        content: content,
        sound: false
      });
      return;
    }

    var id = _lodashNumberRandom2['default'](10000);

    // This will show Windows Tray Balllon in Windows < 10.
    if (electron && !remote.getGlobal('isNotificationSupported')) {
      this.callbacks[id] = callback;
      electron.ipcRenderer.send('showNotification', {
        id: id,
        title: title,
        slug: slug,
        message: content
      });
      return;
    }

    // This will show native HTML Notification.
    var notify = window.notify;

    notify.config(_constants.notificationsConfig);
    var notification = notify.createNotification(title, {
      body: content,
      icon: icon,
      tag: id,
      onclick: function onclick() {
        callback();
        window.focus();
        notification.close();
      }
    });
  };

  return Notifier;
})();

exports.Notifier = Notifier;

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