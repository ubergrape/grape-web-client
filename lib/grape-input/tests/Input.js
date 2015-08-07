'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _test = require('../../test');

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _Input = require('../Input');

var _Input2 = _interopRequireDefault(_Input);

var _mocksData0Json = require('./mocks/data0.json');

var _mocksData0Json2 = _interopRequireDefault(_mocksData0Json);

var render = _reactAddons2['default'].render;
var TestUtils = _reactAddons2['default'].addons.TestUtils;
var Simulate = TestUtils.Simulate;

describe('input:', function () {
  describe('Input()', function () {
    it('should render without props', function () {
      render(_reactAddons2['default'].createElement(_Input2['default'], null), document.body);
      _expectJs2['default'](_test.$('grape-input')).to.be.an(Element);
    });
  });

  describe('Input() with search', function () {
    it('should open search browser', function () {
      var input = _reactAddons2['default'].createElement(_Input2['default'], { browser: 'search', data: _mocksData0Json2['default'], focused: true });
      render(input, document.body);
      var completeWrapper = _test.$('grape-input complete-wrapper');
      _expectJs2['default'](completeWrapper).to.be.an(Element);
      _expectJs2['default'](completeWrapper.children.length).to.be(1);
    });
  });

  describe('Input() auto close', function () {
    function create(onDidMount, onRender) {
      // Results removed.
      var data = _extends({}, _mocksData0Json2['default'], { results: [] });
      var input = _reactAddons2['default'].createElement(_Input2['default'], {
        browser: 'search',
        data: data,
        focused: true,
        onDidMount: onDidMount });
      render(input, document.body, onRender);
    }

    it('shound render "nothing found"', function (done) {
      create(null, function () {
        _expectJs2['default'](_test.$('grape-input empty')).to.be.an(Element);
        done();
      });
    });

    it('should close browser if there is space at the end and no results', function (done) {
      create(function (component) {
        component.query.set('search', 'something ', { silent: true });
        create(null, function () {
          var completeWrapper = _test.$('grape-input complete-wrapper');
          _expectJs2['default'](completeWrapper.children.length).to.be(0);
          done();
        });
      });
    });

    it('should stay opened when space is not at the end', function (done) {
      create(function (component) {
        component.query.set('search', 'something else', { silent: true });
        create(null, function () {
          var completeWrapper = _test.$('grape-input complete-wrapper');
          _expectJs2['default'](completeWrapper.children.length).to.be(1);
          done();
        });
      });
    });

    it('should stay closed when user continued typing after space', function (done) {
      create(function (component) {
        var completeWrapper = _test.$('grape-input complete-wrapper');
        component.query.set('search', 'something else', { silent: true });
        create(null, function () {
          component.query.set('search', 'something else ', { silent: true });
          create(null, function () {
            _expectJs2['default'](completeWrapper.children.length).to.be(0);
            done();
          });
        });
      });
    });
  });

  describe('Input() insert object', function () {
    function insert(onInsertItem, onDidMount) {
      var data = _extends({}, _mocksData0Json2['default']);
      data.search.queries = [];
      var input = _reactAddons2['default'].createElement(_Input2['default'], {
        browser: 'search',
        data: data,
        focused: true,
        onInsertItem: onInsertItem,
        onDidMount: onDidMount });
      render(input, document.body);
      Simulate.keyDown(_test.$('grape-input browser input'), { keyCode: 13 });
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
          _expectJs2['default'](replacement.indexOf('undefined')).to.be(-1);
          done();
        };
      });
    });
  });
});