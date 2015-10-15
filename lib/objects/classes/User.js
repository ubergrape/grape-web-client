'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

var User = (function () {
  function User(options) {
    _classCallCheck(this, User);

    this.id = options.id;
    this.username = options.username;
    this.name = options.name;
    this.url = '/chat/@' + this.username;
    this.content = '@' + this.name;
  }

  // TODO get rid of global classes.

  User.prototype.toHTML = function toHTML() {
    return ('\n      <a\n        href="' + _lodashStringEscape2['default'](this.url) + '"\n        class="ac service-chatgrape type-chatgrapeuser animate"\n        data-object="' + _lodashStringEscape2['default'](String(this)) + '"\n        tabindex="-1">\n        ' + _lodashStringEscape2['default'](this.content) + '\n      </a>\n    ').replace(/\n/g, '');
  };

  User.prototype.toString = function toString() {
    var url = 'cg://chatgrape|user|' + this.id + '|/chat/@' + this.username;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];