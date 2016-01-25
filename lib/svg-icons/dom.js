/**
 * Mini svg manipulation for simple attributes manipulation only.
 */

'use strict';

exports.__esModule = true;
exports['default'] = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashLangToArray = require('lodash/lang/toArray');

var _lodashLangToArray2 = _interopRequireDefault(_lodashLangToArray);

var _toData = require('./toData');

var _toData2 = _interopRequireDefault(_toData);

var List = (function () {
  function List(dom, list) {
    _classCallCheck(this, List);

    this.dom = dom;
    this.list = _lodashLangToArray2['default'](list);
  }

  List.prototype.each = function each(fn) {
    this.list.forEach(fn);
    return this;
  };

  List.prototype.attr = function attr(name, value) {
    this.each(function (node) {
      return node.setAttribute(name, value);
    });
    return this;
  };

  List.prototype.data = function data(encoding) {
    return _toData2['default'](this.svg(), encoding);
  };

  List.prototype.svg = function svg() {
    return this.dom.el.innerHTML;
  };

  List.prototype.node = function node() {
    return this.dom.el.firstChild;
  };

  return List;
})();

var Dom = (function () {
  function Dom(svg) {
    _classCallCheck(this, Dom);

    this.el = document.createElement('div');
    this.el.innerHTML = svg;
  }

  Dom.prototype.find = function find(query) {
    return new List(this, this.el.querySelectorAll(query));
  };

  return Dom;
})();

function create(svg) {
  return new Dom(svg);
}

module.exports = exports['default'];