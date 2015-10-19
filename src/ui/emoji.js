/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var staticurl = require('staticurl');
var jsemoji = require('js-emoji');
jsemoji.img_path = staticurl('emoji/');
jsemoji.sheet_path = staticurl('app/cg/images/emoji_sheet_32_optimized.png');
jsemoji.use_sheet = true;

// https://github.com/ubergrape/chatgrape/issues/839
// https://bugzilla.mozilla.org/show_bug.cgi?id=923007
if (~navigator.userAgent.indexOf('Firefox') && navigator.platform === "MacIntel") {
  jsemoji.allow_native = false;
}

module.exports = jsemoji;
