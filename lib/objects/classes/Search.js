'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('../utils');

var tokenType = 'search';
var trigger = _utils.getTrigger(tokenType);

var Search = (function () {
  function Search(result) {
    _classCallCheck(this, Search);

    this.tokenType = tokenType;
    this.result = result;
    this.id = result.id;
    this.service = result.service;
    this.url = result.url;
    this.type = result.type;
    this.name = trigger + result.name;
    this.content = this.name;
    this.str = this.toString();
  }

  Search.prototype.toString = function toString() {
    var url = 'cg://' + this.service + '|' + this.type + '|' + this.name + '|' + this.url + '||';
    return '[' + this.name + '](' + _utils.encodeMDLink(url) + ')';
  };

  return Search;
})();

exports['default'] = Search;
module.exports = exports['default'];