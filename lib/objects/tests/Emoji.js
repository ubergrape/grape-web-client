'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _ = require('../');

describe('objects: Emoji', function () {
  var object = _.create('emoji', {
    shortname: 'shortname'
  });

  describe('Emoji#toString', function () {
    it('should return correct string', function () {
      _expectJs2['default'](object.toString()).to.be('shortname');
    });
  });

  describe('Emoji#toHTML', function () {
    it('should return shortname', function () {
      _expectJs2['default'](object.toHTML()).to.be('shortname');
    });
  });
});