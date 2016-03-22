'use strict';

exports.__esModule = true;
exports.createNotification = createNotification;
exports.openUrl = openUrl;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var notificationsConfig = {
  pageVisibility: true,
  autoClose: 6000
};

/**
 * Create native html notification.
 */

function createNotification(_ref) {
  var title = _ref.title;
  var content = _ref.content;
  var icon = _ref.icon;
  var callback = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityNoop2['default'] : arguments[1];
  var notify = window.notify;

  if (!notify) return;
  notify.config(notificationsConfig);
  var notification = notify.createNotification(title, {
    icon: icon,
    tag: title,
    body: content,
    onclick: function onclick() {
      window.focus();
      notification.close();
      callback();
    }
  });
}

/**
 * Open an url in browser.
 */

function openUrl(url) {
  var blank = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  if (blank) return window.open(url);
  window.location.href = url;
}