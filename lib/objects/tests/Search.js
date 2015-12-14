'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _ = require('../');

describe('objects: Search', function () {
  var object = _.create('search', {
    id: '8b37ec07b198be90e8086e1065821492',
    service: 'googledrive',
    url: '(https://docs.google.com/a/ubergrape.com(/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&usp=drivesdk)',
    type: 'file',
    name: '>"Plans/Discussions"'
  });

  describe('Search#toString', function () {
    it('should return correct md', function () {
      _expectJs2['default'](object.toString()).to.be('[#>"Plans/Discussions"](cg://googledrive|file|#>"Plans/Discussions"|%28https://docs.google.com/a/ubergrape.com%28/folderview?id=0B_TCKOxiyU4wNTBkNWZiNzAtZTVjZS00ZGUzLWI2ZjItZTNmMThmZjhjMDZj&usp=drivesdk%29||)');
    });
  });
});