/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var should = require('chaijs-chai').should();
var template = require('template');

var UI = require('cg').UI;

template.locals.user = {avatar: "", username:"test"};

describe('dragAndDrop', function () {
	it('should be automaticallly initialized, the dropzone', function (done) {
		var ui = new UI();
		ui.dropzone.should.not.be.an('undefined');
		done();
	});
	it('should be automaticallly initialized, the dragAndDrop', function (done) {
		var ui = new UI();
		ui.dragAndDrop.should.not.be.an('undefined');
		done();
	});
});

