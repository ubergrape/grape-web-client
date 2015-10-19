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

var Room = (function () {
  function Room(options) {
    _classCallCheck(this, Room);

    this.id = options.id;
    this.name = options.name;
    this.slug = options.slug;
    this.url = '/chat/' + this.name;
    this.content = '@' + this.name;
    this.service = 'chatgrape';
    this.type = 'chatgraperoom';
    this.str = this.toString();
  }

  Room.prototype.toHTML = function toHTML() {
    return buildLink(this);
  };

  Room.prototype.toString = function toString() {
    var url = 'cg://chatgrape|room|' + this.id + '|/chat/' + this.slug;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return Room;
})();

exports['default'] = Room;
module.exports = exports['default'];