'use strict';

exports.__esModule = true;
exports.render = render;
exports.$ = $;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

/**
 * Mount container for all components.
 */
var container = undefined;

beforeEach(function () {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(function () {
  _reactDom2['default'].unmountComponentAtNode(container);
  document.body.removeChild(container);
});

function render(element, callback) {
  _reactDom2['default'].render(element, container, callback);
}

/**
 * Its a simplified version of `querySelector` where name is space separated
 * list names. Those names need to be defined in data-test attributes.
 *
 * E.g. $('input wrapper something')
 */

function $(names) {
  var parent = arguments.length <= 1 || arguments[1] === undefined ? container : arguments[1];

  var selector = '';
  names.split(' ').forEach(function (name) {
    selector += '[data-test="' + name + '"] ';
  });
  return parent.querySelector(selector);
}