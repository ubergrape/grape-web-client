'use strict';

exports.__esModule = true;
var SEARCH_TRIGGER = '#';
exports.SEARCH_TRIGGER = SEARCH_TRIGGER;
var MENTION_TRIGGER = '@';
exports.MENTION_TRIGGER = MENTION_TRIGGER;
var EMOJI_TRIGGER = ':';

exports.EMOJI_TRIGGER = EMOJI_TRIGGER;
var TRIGGERS = [SEARCH_TRIGGER, EMOJI_TRIGGER, MENTION_TRIGGER];

exports.TRIGGERS = TRIGGERS;
var SEPARATOR = ':';

exports.SEPARATOR = SEPARATOR;
var TYPES = {
  search: SEARCH_TRIGGER,
  user: MENTION_TRIGGER,
  room: MENTION_TRIGGER,
  emoji: EMOJI_TRIGGER
};

exports.TYPES = TYPES;
// Match everything after a whitespace followed by any trigger until you match
// another whitespace followed by any trigger or end of text.
var REGEX = /(?:^|\s)([#:@])/;
exports.REGEX = REGEX;