'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _test = require('../../test');

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Editable = require('../Editable');

var _Editable2 = _interopRequireDefault(_Editable);

var _Caret = require('../Caret');

var _Caret2 = _interopRequireDefault(_Caret);

describe('editable', function () {
  describe('Editable()', function () {
    it('should render without props', function () {
      _test.render(_react2['default'].createElement(_Editable2['default'], null));
      _expectJs2['default'](_test.$('editable')).to.be.an(Element);
    });
  });

  describe('Editable#modify', function () {
    it('should ensure text whitespaces', function (done) {
      var editable = _react2['default'].createElement(_Editable2['default'], {
        onDidMount: onDidMount,
        focused: true });
      _test.render(editable);
      function onDidMount(component) {
        component.caret.getParent = function () {
          var div = document.createElement('div');
          div.innerHTML = 'a' + _Caret2['default'].MARKER_HTML + 'b&nbsp;';
          return div;
        };
        component.modifyAtCaret(function (left, right) {
          _expectJs2['default'](left).to.be('a');
          _expectJs2['default'](right).to.be('b ');
          return [];
        });
        done();
      }
    });
  });

  describe('Editable#setTextContent', function () {
    it('should call onResize', function (done) {
      var editable = _react2['default'].createElement(_Editable2['default'], {
        onDidMount: onDidMount,
        onResize: onResize,
        focused: true });
      _test.render(editable);
      function onDidMount(component) {
        component.setTextContent('something\nmultiline');
      }
      function onResize() {
        _expectJs2['default'](true).to.be.ok();
        done();
      }
    });
  });
});