'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _test = require('../../test');

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HighlightedTextarea = require('../HighlightedTextarea');

var _HighlightedTextarea2 = _interopRequireDefault(_HighlightedTextarea);

var _objectsClassesRoom = require('../../objects/classes/Room');

var _objectsClassesRoom2 = _interopRequireDefault(_objectsClassesRoom);

describe('highlighted', function () {
  describe('HighlightedTextarea()', function () {
    it('should render without props', function () {
      _test.render(_react2['default'].createElement(_HighlightedTextarea2['default'], null));
      _expectJs2['default'](_test.$('highlighted-textarea')).to.be.an(Element);
    });
  });

  describe('HighlightedTextarea#setTextContent', function () {
    it('should parse markdown', function (done) {
      var resizeFlag = false;

      function onDidMount(component) {
        component.setTextContent('[name](cg://chatgrape|room|1|/chat/slug)');
        setTimeout(function () {
          _expectJs2['default'](component.state.objects['@name']).to.be.a(_objectsClassesRoom2['default']);
          _expectJs2['default'](resizeFlag).to.be(true);
          done();
        }, 0);
      }

      function onResize() {
        resizeFlag = true;
      }

      var textarea = _react2['default'].createElement(_HighlightedTextarea2['default'], {
        onDidMount: onDidMount,
        onResize: onResize,
        focused: true });
      _test.render(textarea);
    });
  });
});