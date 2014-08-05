/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../rendervdom');
var staticurl = require('../../lib/staticurl');

module.exports = Dropzone;

function Dropzone(){
	var vdom = template('draganddrop', {});
	render(this, vdom);
}
