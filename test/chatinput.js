/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');
var template = require('template');

var ChatInput = require('cg').UI.ChatInput;

template.locals.user = {avatar: "", username:"test"};

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
	it.skip('should emit `starttyping` when starting to type', function (done) {
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		ci.on('starttyping', function (r) {
			r.should.equal(room);
			done();
		});
		var textarea = qs('textarea', ci.el);
		trigger(textarea, 'keypress', {key: 'f'});
	});
	it.skip('should emit `stoptyping` after a typing delay', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var start = new Date();
		ci.on('stoptyping', function (r) {
			var diff = new Date() - start;
			diff.should.be.at.least(10);
			r.should.equal(room);
			done();
		});
		var textarea = qs('textarea', ci.el);
		trigger(textarea, 'keypress', {key: 'f'});
	});
	it('should immediately emit `stoptyping` when an input is sent', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('textarea', ci.el);
		trigger(textarea, 'keypress', {key: 'f'});
		var start = new Date();
		ci.on('stoptyping', function (r) {
			var diff = new Date() - start;
			diff.should.be.below(10);
			r.should.equal(room);
			done();
		});
		ci.input.emit('input', 'f');
	});
});

