/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var lib = require('./lib');
exports.App = lib.App;
exports.models = lib.models;

try {

// configure locales and template locals
var template = require('template');
template.root = '/cg/templates';
template.locals.strftime = require('strftime');
var _ = require('t');
['de', 'en'].forEach(function (lang) {
	_.merge(lang, require('./locale/' + lang));
});
template.locals._ = _;

exports.UI = require('./browser');

} catch (e) {} // FIXME: remove this wrapper when the tests are done purely clientside
