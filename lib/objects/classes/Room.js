'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var tokenType = 'room';
var trigger = _utils.getTrigger(tokenType);

var Room = (function () {
  function Room(options) {
    _classCallCheck(this, Room);

    this.tokenType = tokenType;
    this.id = options.id;
    this.name = options.name;
    this.slug = options.slug;
    this.url = '/chat/' + this.name;
    this.content = trigger + this.name;
    this.service = 'chatgrape';
    this.type = 'chatgraperoom';
    this.str = this.toString();
  }

  Room.prototype.toString = function toString() {
    var url = 'cg://chatgrape|room|' + this.id + '|/chat/' + this.slug;
    return '[' + this.name + '](' + _utils.encodeMDLink(url) + ')';
  };

  return Room;
})();

exports['default'] = Room;
module.exports = exports['default'];