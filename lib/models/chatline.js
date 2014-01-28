/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var Model = require('model');
var array = require('model-array');

module.exports = new Model()
	.use(id_time)
	.use(array)
	.array('readers');

// FIXME: gives the line a unique id and datetime field
// remove this workaround as soon as the server provides those fields
var lines = 0;
function id_time(Model) {
	Model.on('construct', function (instance, initial) {
		initial.time = new Date();
		initial.id = lines++;
	});
}
