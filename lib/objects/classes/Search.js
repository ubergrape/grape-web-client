'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _buildLink = require('../buildLink');

var _buildLink2 = _interopRequireDefault(_buildLink);

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

var Search = (function () {
  function Search(result) {
    _classCallCheck(this, Search);

    this.result = result;
    this.id = result.id;
    this.service = result.service;
    this.url = result.url;
    this.type = result.type;
    this.name = result.name;
    this.content = this.name;
    this.str = this.toString();
  }

  Search.prototype.toHTML = function toHTML() {
    return _buildLink2['default'](_extends({}, this, {
      type: this.service + this.type
    }));
  };

  Search.prototype.toString = function toString() {
    var url = 'cg://' + this.service + '|' + this.type + '|' + this.id + '|' + this.url + '||';
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return Search;
})();

exports['default'] = Search;
module.exports = exports['default'];