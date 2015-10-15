'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _encodeMDLink = require('../encodeMDLink');

var _encodeMDLink2 = _interopRequireDefault(_encodeMDLink);

describe('objects:', function () {
  describe('encodeMDLink', function () {
    it('encode paranthesis', function () {
      var encoded = _encodeMDLink2['default']('something (bad)');
      _expectJs2['default'](encoded).to.be('something %28bad%29');
    });
  });
});