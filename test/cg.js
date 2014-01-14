/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var cg = require('../');

describe('ChatGrape', function () {
	it('should have testing with code coverage :-)', function () {
		cg.test().should.be.true; // jshint ignore:line
	});
});
