/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

// configure locales and template locals
var template = require('template');
template.root = '/cg/templates';
template.locals.strftime = require('strftime');
var _ = require('t');
['de', 'en'].forEach(function (lang) {
	_.merge(lang, require('./locale/' + lang));
});
template.locals._ = _;

// FIXME: change language, for now
// this should be done via a switch in the UI
_.lang('de');

// export App and UI
exports.App = require('./lib');
exports.UI = require('./browser');

