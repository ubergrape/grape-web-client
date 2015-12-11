'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _utils = require('../utils');

describe('objects:', function () {
  describe('encodeMDLink', function () {
    it('encode paranthesis', function () {
      var encoded = _utils.encodeMDLink('something (bad)');
      _expectJs2['default'](encoded).to.be('something %28bad%29');
    });
  });
});