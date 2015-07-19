'use strict';

exports.__esModule = true;
exports.formatDateMaybe = formatDateMaybe;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var META_DATES = ['Modified', 'Start', 'End', 'Due', 'Time taken'];
var META_DATES_AGO = ['Modified'];

/**
 * Format date for meta.
 */

function formatDateMaybe(label, value) {
  if (META_DATES.indexOf(label) < 0) return value;

  if (META_DATES_AGO.indexOf(label) >= 0) {
    return _moment2['default'](value).fromNow();
  }

  return _moment2['default'](value).format('L HH:mm');
}