/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

module.exports = process.env.CG_COV
	? require('./lib-cov')
	: require('./lib');
