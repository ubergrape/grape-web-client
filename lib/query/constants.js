'use strict';

exports.__esModule = true;
var TRIGGERS = ['#', ':', '@'];

exports.TRIGGERS = TRIGGERS;
var SEPARATOR = ':';

exports.SEPARATOR = SEPARATOR;
var TYPES = {
  search: '#',
  user: '@',
  room: '@',
  emoji: ':'
};

// Match everything after a whitespace followed by any trigger until you match
// another whitespace followed by any trigger or end of text.
exports.TYPES = TYPES;
var REGEX = /(?:^|\s)([#:@])/;
exports.REGEX = REGEX;