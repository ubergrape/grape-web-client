'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var User = (function () {
  function User(options) {
    _classCallCheck(this, User);

    this.id = options.id;
    this.username = options.username;
    this.name = options.name;
    this.url = '/chat/@' + this.username;
    this.content = '@' + this.name;
  }

  User.prototype.toHTML = function toHTML() {
    var url = _lodashStringEscape2['default'](this.url);
    var object = _lodashStringEscape2['default'](String(this));
    var content = _lodashStringEscape2['default'](this.content);

    // TODO get rid of global classes.
    return '<a href="' + url + '" class="ac service-chatgrape type-chatgrapeuser animate" data-object="' + object + '" tabindex="-1">' + content + '</a>';
  };

  User.prototype.toString = function toString() {
    return '[' + this.name + '](cg://chatgrape|user|' + this.id + '|/chat/@' + this.username + ')';
  };

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];