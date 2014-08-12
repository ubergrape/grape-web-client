/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var should = require('chaijs-chai').should();
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
	it('should emit `starttyping` when starting to type', function (done) {
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		ci.on('starttyping', function (r) {
			r.should.equal(room);
			done();
		});
		var textarea = qs('.messageInput', ci.el);
		trigger(textarea, 'keypress', {key: 'f'});
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
			diff.should.be.at.least(10);
			r.should.equal(room);
			done();
		});
		var textarea = qs('.messageInput', ci.el);
		trigger(textarea, 'keypress', {key: 'f'});
	});
	it('should immediately emit `stoptyping` when an input is sent', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
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
	it('regex should match certain inputs for autocomplete', function (done) {
		ChatInput.DELAY = 10;
		var ci = new ChatInput();

		var match;

		match = "@match".match(ci.complete.re);
		match.should.have.length(4);
		match[2].should.equal('@');
		match[3].should.equal('match');

		match = "this should also @match".match(ci.complete.re);
		match.length.should.equal(4);
		match[2].should.equal('@');
		match[3].should.equal('match');

		match = "this shouldnt work test@example.com".match(ci.complete.re);
		should.not.exist(match);

		match = "we love\nmultine\n@match".match(ci.complete.re);
		match.length.should.equal(4);
		match[2].should.equal('@');
		match[3].should.equal('match');

		match = "don't @match in the middle".match(ci.complete.re);
		should.not.exist(match);

		match = "hey also :emoji".match(ci.complete.re);
		match.length.should.equal(4);
		match[2].should.equal(':');
		match[3].should.equal('emoji');

		match = "hey also #issues".match(ci.complete.re);
		match.length.should.equal(4);
		match[2].should.equal('#');
		match[3].should.equal('issues');

		done();
	});
});

