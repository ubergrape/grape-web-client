'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

var _lodashStringTemplate = require('lodash/string/template');

var _lodashStringTemplate2 = _interopRequireDefault(_lodashStringTemplate);

// TODO Stop using global classes
var buildLink = _lodashStringTemplate2['default']('<a ' + 'tabindex="-1" ' + 'href="<%- url %>" ' + 'data-object="<%- str %>" ' + 'class="ac animate service-<%- service %> type-<%- type %>">' + '<%- content %>' + '</a>');

var User = (function () {
  function User(options) {
    _classCallCheck(this, User);

    this.id = options.id;
    this.username = options.username;
    this.name = options.name;
    this.url = '/chat/@' + this.username;
    this.content = '@' + this.name;
    this.service = 'chatgrape';
    this.type = 'chatgrapeuser';
    this.str = this.toString();
  }

  User.prototype.toHTML = function toHTML() {
    return buildLink(this);
  };

  User.prototype.toString = function toString() {
    var url = 'cg://chatgrape|user|' + this.id + '|/chat/@' + this.username;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];