'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stringify = require('../stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

describe('query', function () {
  describe('.stringify()', function () {
    it('should stringify with trigger only', function () {
      var str = _stringify2['default']({ trigger: '#' });
      _expectJs2['default'](str).to.be('#');
    });

    it('should stringify with a search', function () {
      var str = _stringify2['default']({
        trigger: '#',
        search: 'something'
      });
      _expectJs2['default'](str).to.be('#something');
    });

    it('should stringify with a filter', function () {
      var str = _stringify2['default']({
        trigger: '#',
        filters: ['filter0']
      });
      _expectJs2['default'](str).to.be('#filter0:');
    });

    it('should stringify with filters', function () {
      var str = _stringify2['default']({
        trigger: '#',
        filters: ['filter0', 'filter1']
      });
      _expectJs2['default'](str).to.be('#filter0:filter1:');
    });

    it('should stringify with filter and search', function () {
      var str = _stringify2['default']({
        trigger: '#',
        filters: ['filter0'],
        search: 'something'
      });
      _expectJs2['default'](str).to.be('#filter0:something');
    });
  });
});