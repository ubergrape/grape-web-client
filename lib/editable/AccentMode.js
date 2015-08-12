'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashFunctionBindAll = require('lodash/function/bindAll');

var _lodashFunctionBindAll2 = _interopRequireDefault(_lodashFunctionBindAll);

/**
 * Accent mode detector which can be triggered by ~`´^ and maybe
 * more characters.
 * If an Input Method Editor is processing key input and the event is keydown, return 229.
 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
 */

var AccentMode = (function () {
  function AccentMode(node) {
    _classCallCheck(this, AccentMode);

    this.active = false;
    this.node = node;
    _lodashFunctionBindAll2['default'](this, 'onClick', 'onKeyDown', 'onBlur');
    this.addListeners();
  }

  AccentMode.prototype.addListeners = function addListeners() {
    this.node.addEventListener('click', this.onClick);
    this.node.addEventListener('blur', this.onBlur);
    this.node.addEventListener('keydown', this.onKeyDown);
  };

  AccentMode.prototype.onClick = function onClick() {
    this.active = false;
  };

  AccentMode.prototype.onBlur = function onBlur() {
    this.active = false;
  };

  AccentMode.prototype.onKeyDown = function onKeyDown(e) {
    this.active = e.keyCode === 229;
  };

  return AccentMode;
})();

exports['default'] = AccentMode;
module.exports = exports['default'];