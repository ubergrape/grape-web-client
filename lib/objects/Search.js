'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

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
  }

  Search.prototype.toHTML = function toHTML() {
    var url = _lodashStringEscape2['default'](this.url);
    var service = _lodashStringEscape2['default'](this.service);
    var type = _lodashStringEscape2['default'](this.type);
    var object = _lodashStringEscape2['default'](String(this));
    var content = _lodashStringEscape2['default'](this.content);
    var result = _lodashStringEscape2['default'](JSON.stringify(this.result));
    // TODO get rid of global classes.
    return '<a href="' + url + '" target="_blank" class="ac service-' + service + ' type-' + service + type + ' animate" data-object="' + object + '" data-result="' + result + '" tabindex="-1">' + content + '</a>';
  };

  Search.prototype.toString = function toString() {
    return '[' + this.name + '](cg://' + this.service + '|' + this.type + '|' + this.id + '|' + this.url + '||)';
  };

  return Search;
})();

exports['default'] = Search;
module.exports = exports['default'];