'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashLangToArray = require('lodash/lang/toArray');

var _lodashLangToArray2 = _interopRequireDefault(_lodashLangToArray);

var _componentQuery = require('component-query');

var _componentQuery2 = _interopRequireDefault(_componentQuery);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var GRAPE_MARKER_CLASS = 'grape-browser-marker';

// TODO use it from scribe.
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
  }, {
    key: 'renameMarkers',
    value: function value() {
      var markers = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
      var dir = arguments.length <= 1 || arguments[1] === undefined ? 'scribe' : arguments[1];

      markers.forEach(function (marker) {
        marker.className = dir === 'scribe' ? MARKER_CLASS : GRAPE_MARKER_CLASS;
      });
    },
    enumerable: true
  }]);

  function Caret(scribe) {
    _classCallCheck(this, Caret);

    this.scribe = scribe;
  }

  /**
   * Focus element if not already focused.
   * Returns true if did focus set.
   */

  Caret.prototype.focus = function focus() {
    var el = this.scribe.el;

    if (el !== document.activeElement) {
      el.focus();
      return true;
    }
    return false;
  };

  /**
   * Create an instance of Selection.
   */

  Caret.prototype.createSelection = function createSelection(focus) {
    if (focus) this.focus();
    return new this.scribe.api.Selection();
  };

  /**
   * Place markers and remove all markers except of the first one.
   */

  Caret.prototype.placeMarker = function placeMarker() {
    var selection = arguments.length <= 0 || arguments[0] === undefined ? this.createSelection(true) : arguments[0];

    selection.placeMarkers();
    var markers = this.getMarkers({ selection: selection });
    markers.shift();
    markers.forEach(utils.remove);
  };

  /**
   * Returns scribe markers by default.
   * If grape is true, returns also grape markers.
   */

  Caret.prototype.getMarkers = function getMarkers() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref$grape = _ref.grape;
    var grape = _ref$grape === undefined ? false : _ref$grape;
    var _ref$scribe = _ref.scribe;
    var scribe = _ref$scribe === undefined ? true : _ref$scribe;
    var selection = _ref.selection;

    var markers = [];

    if (scribe) {
      var sel = selection || this.createSelection(true);
      var scribeMarkers = _lodashLangToArray2['default'](sel.getMarkers());
      markers = markers.concat(scribeMarkers);
    }

    if (grape) {
      var grapeMarkers = _lodashLangToArray2['default'](_componentQuery2['default'].all('.' + GRAPE_MARKER_CLASS, this.scribe.el));
      markers = markers.concat(grapeMarkers);
    }

    return markers;
  };

  /**
   * Get parent node of the caret.
   */

  Caret.prototype.getParent = function getParent() {
    var selection = arguments.length <= 0 || arguments[0] === undefined ? this.createSelection(true) : arguments[0];

    return selection.getContaining(utils.isElement);
  };

  /**
   * Get text before/after the caret position.
   */

  Caret.prototype.getText = function getText(side) {
    var selection = arguments.length <= 1 || arguments[1] === undefined ? this.createSelection(true) : arguments[1];

    this.placeMarker(selection);
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
    var selection = this.createSelection(true);
    if (side) utils.insert(side, MARKER_EL, node);
    selection.selectMarkers();
  };

  return Caret;
})();

exports['default'] = Caret;
module.exports = exports['default'];