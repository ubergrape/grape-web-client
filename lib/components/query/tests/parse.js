'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _parse = require('../parse');

var _parse2 = _interopRequireDefault(_parse);

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

describe('query', function () {
  describe('.parse()', function () {
    it('should parse empty query string', function () {
      var query = _parse2['default']('');
      _expectJs2['default'](query).to.eql({
        query: '',
        key: '',
        trigger: undefined,
        filters: [],
        search: ''
      });
    });

    it('should parse query with trigger only', function () {
      var query = _parse2['default']('#');
      _expectJs2['default'](query).to.eql({
        query: '#',
        key: '',
        trigger: '#',
        filters: [],
        search: ''
      });
    });

    it('should parse query with search', function () {
      var query = _parse2['default']('#something');
      _expectJs2['default'](query).to.eql({
        query: '#something',
        key: 'something',
        trigger: '#',
        filters: [],
        search: 'something'
      });
    });

    it('should parse query with a filter', function () {
      var query = _parse2['default']('#filter0:');
      _expectJs2['default'](query).to.eql({
        query: '#filter0:',
        key: 'filter0:',
        trigger: '#',
        filters: ['filter0'],
        search: ''
      });
    });

    it('should parse query with filters', function () {
      var query = _parse2['default']('#filter0:filter1:');
      _expectJs2['default'](query).to.eql({
        query: '#filter0:filter1:',
        key: 'filter0:filter1:',
        trigger: '#',
        filters: ['filter0', 'filter1'],
        search: ''
      });
    });

    it('should parse query with filter and search', function () {
      var query = _parse2['default']('#filter0:something');
      _expectJs2['default'](query).to.eql({
        query: '#filter0:something',
        key: 'filter0:something',
        trigger: '#',
        filters: ['filter0'],
        search: 'something'
      });
    });
  });
});