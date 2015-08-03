'use strict';

exports.__esModule = true;
exports.map = map;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jss = require('../jss');

var _emojiIcon = require('../emoji/Icon');

var _emojiIcon2 = _interopRequireDefault(_emojiIcon);

var _style = require('./style');

var _style2 = _interopRequireDefault(_style);

var sheet = _jss.jss.createStyleSheet(_style2['default']).attach();

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
      item.icon = _react2['default'].createElement(_emojiIcon2['default'], { name: item.name, style: iconStyle });
      return;
    }

    item.icon = _react2['default'].createElement(_emojiIcon2['default'], { name: item.name, className: 'fa fa-comments ' + sheet.classes.icon });
  });

  return data;
}