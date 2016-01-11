'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _test = require('../../test');

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _GrapeInput = require('../GrapeInput');

var _GrapeInput2 = _interopRequireDefault(_GrapeInput);

var _mocksData0Json = require('./mocks/data0.json');

var _mocksData0Json2 = _interopRequireDefault(_mocksData0Json);

describe('grape-input:', function () {
  describe('GrapeInput()', function () {
    it('should render without props', function () {
      _test.render(_react2['default'].createElement(_GrapeInput2['default'], null));
      _expectJs2['default'](_test.$('grape-input')).to.be.an(Element);
    });
  });

  describe('GrapeInput() with search', function () {
    it('should open search browser', function () {
      var input = _react2['default'].createElement(_GrapeInput2['default'], { browser: 'search', data: _mocksData0Json2['default'], focused: true });
      _test.render(input);
      _expectJs2['default'](_test.$('search-browser', document.body)).to.be.an(Element);
    });
  });

  describe('GrapeInput() auto close', function () {
    function create(onDidMount, onRender) {
      // Results removed.
      var data = _extends({}, _mocksData0Json2['default'], { results: [] });
      var input = _react2['default'].createElement(_GrapeInput2['default'], {
        browser: 'search',
        data: data,
        onDidMount: onDidMount,
        focused: true });
      _test.render(input, onRender);
    }

    it('shound render "nothing found"', function (done) {
      create(null, function () {
        _expectJs2['default'](_test.$('search-browser empty', document.body)).to.be.an(Element);
        done();
      });
    });

    it('should close browser if there is space at the end and no results', function (done) {
      create(function (component) {
        component.query.set('search', 'something ', { silent: true });
        create(null, function () {
          var browser = _test.$('search-browser', document.body);
          _expectJs2['default'](browser).to.be(null);
          done();
        });
      });
    });

    it('should stay opened when space is not at the end', function (done) {
      create(function (component) {
        component.query.set('search', 'something else', { silent: true });
        create(null, function () {
          var browser = _test.$('search-browser', document.body);
          _expectJs2['default'](browser).to.be.an(Element);
          done();
        });
      });
    });
  });

  describe('GrapeInput() insert object', function () {
    function insert(onInsertItem, onDidMount) {
      var data = _extends({}, _mocksData0Json2['default']);
      data.search.queries = [];
      var input = _react2['default'].createElement(_GrapeInput2['default'], {
        browser: 'search',
        data: data,
        onInsertItem: onInsertItem,
        onDidMount: onDidMount,
        focused: true });
      _test.render(input);
      _reactAddonsTestUtils.Simulate.keyDown(_test.$('search-browser input', document.body), { keyCode: 13 });
    }

    it('should call onInsertItem with correct argument', function (done) {
      insert(function (param) {
        _expectJs2['default'](param.type).to.be('file');
        _expectJs2['default'](param.service).to.be('googledrive');
        _expectJs2['default'](param.rank).to.be(1);
        done();
      });
    });

    it('should call replaceQuery with correct replacement', function (done) {
      insert(null, function (input) {
        input.replaceQuery = function (replacement) {
          // Verify there are no missing params in objects.
          _expectJs2['default'](replacement.name).to.be('"Plans/Discussions"');
          _expectJs2['default'](replacement.content).to.be('#"Plans/Discussions"');
          done();
        };
      });
    });
  });
});