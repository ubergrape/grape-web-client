/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var template = require('template');
var render = require('../rendervdom');

module.exports = Dropzone;

Dropzone.prototype.init = function Dropzone_init(){
	render(this.template('draganddrop'), {});
}
