/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');

var ChatInput = require('cg').UI.ChatInput;

describe('ChatInput', function () {
	// webkit wtf? https://code.google.com/p/chromium/issues/detail?id=120494
	var added;
	function add(el) {
		document.body.appendChild(el);
		added = el;
	}
	afterEach(function () {
		if (!added) return;
		added.parentNode.removeChild(added);
		added = null;
	});
	it('should have a .el', function () {
		var ci = new ChatInput();
		ci.el.should.be.an.instanceof(Element);
	});
	it.skip('should emit a `input` event when pressing enter', function (done) {
		var ci = new ChatInput();
		add(ci.el);
		ci.el.value = 'foobar';
		ci.on('input', function (term) {
			term.should.eql('foobar');
			done();
		});
		// FIXME: I currently see no way to really test this?
		trigger(ci.el, 'keyup', {key: 'Enter'});
	});
	it('should emit `starttyping` when starting to type', function (done) {
		var ci = new ChatInput();
		add(ci.el);
		ci.on('starttyping', function () {
			done();
		});
		trigger(ci.el, 'keydown', {key: 'f'});
	});
	it('should emit `stoptyping` after a typing delay', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();
		add(ci.el);
		var start = new Date();
		ci.on('stoptyping', function () {
			var diff = new Date() - start;
			diff.should.be.above(10);
			done();
		});
		trigger(ci.el, 'keyup', {key: 'f'});
	});
});

