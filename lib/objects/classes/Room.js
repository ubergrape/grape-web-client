'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

var _buildLink = require('../buildLink');

var _buildLink2 = _interopRequireDefault(_buildLink);

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
    return _buildLink2['default'](this);
  };

  Room.prototype.toString = function toString() {
    var url = 'cg://chatgrape|room|' + this.id + '|/chat/' + this.slug;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return Room;
})();

exports['default'] = Room;
module.exports = exports['default'];