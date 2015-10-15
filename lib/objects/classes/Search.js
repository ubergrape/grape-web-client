'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashStringEscape = require('lodash/string/escape');

var _lodashStringEscape2 = _interopRequireDefault(_lodashStringEscape);

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
  }

  // TODO get rid of global classes.

  Search.prototype.toHTML = function toHTML() {
    var service = _lodashStringEscape2['default'](this.service);
    var type = _lodashStringEscape2['default'](this.type);
    return ('\n      <a tabindex="-1"\n        target="_blank"\n        href="' + _lodashStringEscape2['default'](this.url) + '"\n        data-object="' + _lodashStringEscape2['default'](String(this)) + '"\n        data-result="' + _lodashStringEscape2['default'](JSON.stringify(this.result)) + '"\n        class="ac service-' + service + ' type-' + service + type + ' animate">\n        ' + _lodashStringEscape2['default'](this.content) + '\n      </a>\n    ').replace(/\n/g, '');
  };

  Search.prototype.toString = function toString() {
    var url = 'cg://' + this.service + '|' + this.type + '|' + this.id + '|' + this.url + '||';
    return '[' + this.name + '](' + _encodeMDLink2['default'](url) + ')';
  };

  return Search;
})();

exports['default'] = Search;
module.exports = exports['default'];