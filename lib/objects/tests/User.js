'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _ = require('../');

describe('objects: User', function () {
  var object = _.create('user', {
    id: '1',
    username: 'username',
    name: 'name'
  });

  describe('User#toString', function () {
    it('should return correct md', function () {
      _expectJs2['default'](object.toString()).to.be('[name](cg://chatgrape|user|1|/chat/@username)');
    });
  });

  describe('User#toHTML', function () {
    it('should return correct html', function () {
      _expectJs2['default'](object.toHTML().replace(/\s/g, '')).to.be('\n        <a\n          href="/chat/@username"\n          class="ac service-chatgrape type-chatgrapeuser animate"\n          data-object="[name](cg://chatgrape|user|1|/chat/@username)"\n          tabindex="-1">\n          @name\n        </a>\n      '.replace(/\s/g, ''));
    });
  });
});