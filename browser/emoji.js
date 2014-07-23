/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var staticurl = require('../lib/staticurl');
var jsemoji = require('js-emoji');
jsemoji.img_path = staticurl('emoji/');
jsemoji.sheet_path = staticurl('app/sk7-js-emoji/images/sheet_32.png');
jsemoji.use_sheet = true;

module.exports = jsemoji;
