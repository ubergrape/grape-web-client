'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashLangToArray = require('lodash/lang/toArray');

var _lodashLangToArray2 = _interopRequireDefault(_lodashLangToArray);

var _utils = require('./utils');

// TODO use it from scribe.

var utils = _interopRequireWildcard(_utils);

var MARKER_CLASS = 'scribe-marker';
var MARKER_EL = document.createElement('em');
MARKER_EL.className = MARKER_CLASS;

/**
 * Helper class for caret manipulation.
 */

var Caret = (function () {
  _createClass(Caret, null, [{
    key: 'MARKER_HTML',
    value: '<em class="' + MARKER_CLASS + '" style="display: none;"></em>',
    enumerable: true
  }]);

  function Caret(scribe) {
    _classCallCheck(this, Caret);

    this.scribe = scribe;
    this.Selection = scribe.api.Selection;
  }

  /**
   * Place markers and remove all markers except of the first one.
   */

  Caret.prototype.placeMarker = function placeMarker() {
    this.scribe.el.focus();
    var selection = new this.Selection();
    selection.placeMarkers();
    var markers = _lodashLangToArray2['default'](selection.getMarkers());
    markers.shift();
    markers.forEach(utils.remove);
    return selection;
  };

  /**
   * Get parent node of the caret.
   */

  Caret.prototype.getParent = function getParent(sel) {
    var selection = sel;
    if (!selection) {
      this.scribe.el.focus();
      selection = new this.Selection();
    }
    return selection.getContaining(utils.isElement);
  };

  /**
   * Get text before/after the caret position.
   */

  Caret.prototype.getText = function getText(side) {
    var selection = this.placeMarker();
    var parent = this.getParent(selection).cloneNode(true);
    // Remove all elements except of marker.
    _lodashLangToArray2['default'](parent.childNodes).forEach(function (node) {
      if (utils.isElement(node) && node.className !== MARKER_CLASS) {
        utils.remove(node);
      }
    });
    var parts = parent.innerHTML.split(Caret.MARKER_HTML);
    return parts[side === 'before' ? 0 : 1];
  };

  /**
   * Move caret before/after the node or after already existing marker.
   */

  Caret.prototype.move = function move(side, node) {
    this.scribe.el.focus();
    if (side) utils.insert(side, MARKER_EL, node);
    var selection = new this.Selection();
    selection.selectMarkers();
  };

  return Caret;
})();

exports['default'] = Caret;
module.exports = exports['default'];