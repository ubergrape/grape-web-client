'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

var Room = (function () {
  function Room(options) {
    _classCallCheck(this, Room);

    this.id = options.id;
    this.name = options.name;
    this.slug = options.slug;
    this.url = '/chat/' + this.name;
    this.content = '@' + this.name;
  }

  Room.prototype.toHTML = function toHTML() {
    var url = _lodashStringEscape2['default'](this.url);
    var object = _lodashStringEscape2['default'](String(this));
    var content = _lodashStringEscape2['default'](this.content);

    // TODO get rid of global classes.
    return '<a href="' + url + '" class="ac service-chatgrape type-chatgraperoom animate" data-object="' + object + '" tabindex="-1">' + content + '</a>';
  };

  Room.prototype.toString = function toString() {
    return '[' + this.name + '](cg://chatgrape|room|' + this.id + '|/chat/' + this.slug + ')';
  };

  return Room;
})();

exports['default'] = Room;
module.exports = exports['default'];