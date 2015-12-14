'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var tokenType = 'user';
var trigger = _utils.getTrigger(tokenType);

var User = (function () {
  function User(options) {
    _classCallCheck(this, User);

    this.tokenType = tokenType;
    this.id = options.id;
    this.username = options.username;
    this.name = options.name;
    this.url = '/chat/@' + this.username;
    this.content = trigger + this.name;
    this.service = 'chatgrape';
    this.type = 'chatgrapeuser';
    this.str = this.toString();
  }

  User.prototype.toString = function toString() {
    var url = 'cg://chatgrape|user|' + this.id + '|/chat/@' + this.username;
    return '[' + this.name + '](' + _utils.encodeMDLink(url) + ')';
  };

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];