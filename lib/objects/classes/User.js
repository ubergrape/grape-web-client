'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _buildLink = require('../buildLink');

var _buildLink2 = _interopRequireDefault(_buildLink);

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
    this.service = 'chatgrape';
    this.type = 'chatgrapeuser';
    this.str = this.toString();
  }

  User.prototype.toHTML = function toHTML() {
    return _buildLink2['default'](this);
  };

  User.prototype.toString = function toString() {
    var url = 'cg://chatgrape|user|' + this.id + '|/chat/@' + this.username;
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return User;
})();

exports['default'] = User;
module.exports = exports['default'];