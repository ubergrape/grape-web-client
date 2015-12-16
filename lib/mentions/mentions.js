'use strict';

exports.__esModule = true;
exports.map = map;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _grapeWebLibJss = require('grape-web/lib/jss');

var _iconIcon = require('../icon/Icon');

var _iconIcon2 = _interopRequireDefault(_iconIcon);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var sheet = _grapeWebLibJss.jss.createStyleSheet(_style2['default']).attach();

function getIcon(item) {
  if (item.currentRoom) return 'bell';
  return item.isPrivate ? 'lock' : 'comments';
}

function getRoomNote(item) {
  if (item.currentRoom) return 'notify everyone in this room';
  return '(only a link, no notifications)';
}

/**
 * Change data for representation.
 */

function map(data) {
  data.forEach(function (item) {
    if (item.type === 'user') {
      var iconStyle = {
        backgroundImage: 'url(' + item.iconURL + ')',
        borderRadius: '100%'
      };
      item.icon = _react2['default'].createElement(_iconIcon2['default'], { name: item.name, style: iconStyle });
      if (!item.inRoom) item.note = '(not in room)';
      return;
    }
    item.note = getRoomNote(item);
    item.icon = _react2['default'].createElement(_iconIcon2['default'], { name: item.name, className: 'fa fa-' + getIcon(item) + ' ' + sheet.classes.icon });
  });

  data.sort(function (a, b) {
    // current room (mention all) always on top
    if (a.currentRoom) return -1;
    if (b.currentRoom) return 1;

    // not users (rooms) are always last
    if (a.type !== 'user') return 1;
    if (b.type !== 'user') return -1;

    if (a.inRoom === b.inRoom) return 0;

    // move on top users that are in this room
    return a.inRoom ? -1 : 1;
  });

  return data;
}