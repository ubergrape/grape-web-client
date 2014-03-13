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
	it('should emit a `input` when text is entered', function (done) {
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		ci.on('input', function (r, term) {
			r.should.equal(room);
			term.should.eql('foobar');
			done();
		});
		ci.input.emit('input', '   foobar   ');
	});
	it('should not emit when the text is empty', function () {
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		ci.on('input', function () {
			throw new Error('should not be reached');
		});
		ci.input.emit('input', '   \n \t   ');
	});
	it('should emit `starttyping` when starting to type', function (done) {
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		ci.on('starttyping', function (r) {
			r.should.equal(room);
			done();
		});
		trigger(ci.el, 'keydown', {key: 'f'});
	});
	it('should emit `stoptyping` after a typing delay', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var start = new Date();
		ci.on('stoptyping', function (r) {
			var diff = new Date() - start;
			diff.should.be.above(10);
			r.should.equal(room);
			done();
		});
		trigger(ci.el, 'keyup', {key: 'f'});
	});
});

