'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _test = require('../../test');

var _lodashUtilityNoop = require('lodash/utility/noop');

var _lodashUtilityNoop2 = _interopRequireDefault(_lodashUtilityNoop);

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _Editable = require('../Editable');

var _Editable2 = _interopRequireDefault(_Editable);

var _Caret = require('../Caret');

var _Caret2 = _interopRequireDefault(_Caret);

var render = _reactAddons2['default'].render;

describe('editable', function () {
  describe('Editable()', function () {
    it('should render without props', function () {
      render(_reactAddons2['default'].createElement(_Editable2['default'], null), document.body);
      _expectJs2['default'](_test.$('editable')).to.be.an(Element);
    });
  });

  describe('Editable#modify', function () {
    it('should ensure text whitespaces', function (done) {
      var editable = _reactAddons2['default'].createElement(_Editable2['default'], {
        onDidMount: onDidMount,
        onChange: _lodashUtilityNoop2['default'],
        focused: true });
      render(editable, document.body);
      function onDidMount(component) {
        component.caret.getParent = function () {
          var div = document.createElement('div');
          div.innerHTML = 'a' + _Caret2['default'].MARKER_HTML + 'b&nbsp;';
          return div;
        };
        component.modify(function (left, right) {
          _expectJs2['default'](left).to.be('a');
          _expectJs2['default'](right).to.be('b ');
          return [];
        });
        done();
      }
    });
  });
});