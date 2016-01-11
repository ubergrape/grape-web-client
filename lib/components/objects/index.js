'use strict';

exports.__esModule = true;
exports.create = create;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classesUser = require('./classes/User');

var _classesUser2 = _interopRequireDefault(_classesUser);

var _classesSearch = require('./classes/Search');

var _classesSearch2 = _interopRequireDefault(_classesSearch);

var _classesRoom = require('./classes/Room');

var _classesRoom2 = _interopRequireDefault(_classesRoom);

var _classesEmoji = require('./classes/Emoji');

var _classesEmoji2 = _interopRequireDefault(_classesEmoji);

var types = {
  user: _classesUser2['default'],
  customEmoji: _classesEmoji2['default'],
  emoji: _classesEmoji2['default'],
  search: _classesSearch2['default'],
  room: _classesRoom2['default']
};

function create(type, options) {
  var Obj = types[type] || _classesSearch2['default'];
  return new Obj(options);
}