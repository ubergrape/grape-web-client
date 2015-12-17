'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _findMatches = require('../findMatches');

var _findMatches2 = _interopRequireDefault(_findMatches);

describe('findMatches()', function () {
  it('should return single match', function () {
    var matches = _findMatches2['default']('a', 'a');
    _expectJs2['default'](matches.length).to.be(1);
    _expectJs2['default'](matches[0].text).to.be('a');
    _expectJs2['default'](matches[0].found).to.be.ok();
  });

  it('should return case insensitive match', function () {
    var matches = _findMatches2['default']('a', 'A');
    _expectJs2['default'](matches.length).to.be(1);
    _expectJs2['default'](matches[0].text).to.be('a');
    _expectJs2['default'](matches[0].found).to.be.ok();
  });

  it('should return word only match (0)', function () {
    var matches = _findMatches2['default']('ab', 'a');
    _expectJs2['default'](matches.length).to.be(1);
    _expectJs2['default'](matches[0].text).to.be('ab');
    _expectJs2['default'](matches[0].found).to.not.be.ok();
  });

  it('should return word only match (1)', function () {
    var matches = _findMatches2['default']('ba', 'a');
    _expectJs2['default'](matches.length).to.be(1);
    _expectJs2['default'](matches[0].text).to.be('ba');
    _expectJs2['default'](matches[0].found).to.not.be.ok();
  });

  it('should return word only match (2)', function () {
    var matches = _findMatches2['default']('a,', 'a');
    _expectJs2['default'](matches.length).to.be(2);
    _expectJs2['default'](matches[0].text).to.be('a');
    _expectJs2['default'](matches[0].found).to.be.ok();
    _expectJs2['default'](matches[1].text).to.be(',');
    _expectJs2['default'](matches[1].found).to.not.be.ok();
  });

  it('should return word only match (3)', function () {
    var matches = _findMatches2['default'](',a', 'a');
    _expectJs2['default'](matches.length).to.be(2);
    _expectJs2['default'](matches[0].text).to.be(',');
    _expectJs2['default'](matches[0].found).to.not.be.ok();
    _expectJs2['default'](matches[1].text).to.be('a');
    _expectJs2['default'](matches[1].found).to.be.ok();
  });

  it('should return multi match', function () {
    var matches = _findMatches2['default']('a a', 'a');
    _expectJs2['default'](matches.length).to.be(3);
    _expectJs2['default'](matches[0].text).to.be('a');
    _expectJs2['default'](matches[0].found).to.be.ok();
    _expectJs2['default'](matches[1].text).to.be(' ');
    _expectJs2['default'](matches[1].found).to.not.be.ok();
    _expectJs2['default'](matches[2].text).to.be('a');
    _expectJs2['default'](matches[2].found).to.be.ok();
  });

  it('should use multi search', function () {
    var matches = _findMatches2['default']('a b', ['a', 'b']);
    _expectJs2['default'](matches.length).to.be(3);
    _expectJs2['default'](matches[0].text).to.be('a');
    _expectJs2['default'](matches[0].found).to.be.ok();
    _expectJs2['default'](matches[1].text).to.be(' ');
    _expectJs2['default'](matches[1].found).to.not.be.ok();
    _expectJs2['default'](matches[2].text).to.be('b');
    _expectJs2['default'](matches[2].found).to.be.ok();
  });

  it('shoud match word combination', function () {
    var matches = _findMatches2['default']('a b c d', 'b c');
    _expectJs2['default'](matches.length).to.be(3);
    _expectJs2['default'](matches[0].text).to.be('a ');
    _expectJs2['default'](matches[0].found).to.not.be.ok();
    _expectJs2['default'](matches[1].text).to.be('b c');
    _expectJs2['default'](matches[1].found).to.be.ok();
    _expectJs2['default'](matches[2].text).to.be(' d');
    _expectJs2['default'](matches[2].found).to.not.be.ok();
  });

  it('shoud match multiple word combinations', function () {
    var matches = _findMatches2['default']('a b c d e', ['b c', 'd e']);
    _expectJs2['default'](matches.length).to.be(4);
    _expectJs2['default'](matches[0].text).to.be('a ');
    _expectJs2['default'](matches[0].found).to.not.be.ok();
    _expectJs2['default'](matches[1].text).to.be('b c');
    _expectJs2['default'](matches[1].found).to.be.ok();
    _expectJs2['default'](matches[2].text).to.be(' ');
    _expectJs2['default'](matches[2].found).to.not.be.ok();
    _expectJs2['default'](matches[3].text).to.be('d e');
    _expectJs2['default'](matches[3].found).to.be.ok();
  });
});