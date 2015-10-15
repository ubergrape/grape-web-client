'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

var Room = (function () {
  function Room(options) {
    _classCallCheck(this, Room);

    this.id = options.id;
    this.name = options.name;
    this.slug = options.slug;
    this.url = '/chat/' + this.name;
    this.content = '@' + this.name;
  }

  // TODO get rid of global classes.

  Room.prototype.toHTML = function toHTML() {
    return ('\n      <a\n        href="' + _lodashStringEscape2['default'](this.url) + '"\n        class="ac service-chatgrape type-chatgraperoom animate"\n        data-object="' + _lodashStringEscape2['default'](String(this)) + '"\n        tabindex="-1">\n        ' + _lodashStringEscape2['default'](this.content) + '\n      </a>\n    ').replace(/\n/g, '');
  };

  Room.prototype.toString = function toString() {
    var url = 'cg://chatgrape|room|' + this.id + '|/chat/' + this.slug;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return Room;
})();

exports['default'] = Room;
module.exports = exports['default'];