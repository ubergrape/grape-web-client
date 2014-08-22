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
	it('should have the message input', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.should.not.be.an('undefined');
		done();
	});
	it('should have childNodes in the textarea', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		textarea.childNodes.should.not.be.an('undefined');
		done();
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
	it('should work with one simple div', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		var div = document.createElement("div");
		div.textContent = "testtest";
		textarea.appendChild(div);
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('keyup');
		ev.keyCode = 13;
		/*delete ev.keyCode;
		Object.defineProperty(ev, "keyCode", {"value" : 13})*/
		ci.input.on('input', function (str) {
			str.should.equal('\ntesttest'); 
			done();
		});
		textarea.dispatchEvent(ev);
	});
	it('should handle pasting simple group of divs', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		var div = document.createElement("div");
		div.textContent = "Felix Haeusler";
		textarea.appendChild(div);
		div = document.createElement("div");
		div.textContent = "Leo Fasbender";
		textarea.appendChild(div);
		div = document.createElement("div");
		div.textContent = "Stefan Kroener";
		textarea.appendChild(div);
		div = document.createElement("div");
		div.textContent = "Mohamed Elrakaiby";
		textarea.appendChild(div);
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('keyup');
		ev.keyCode = 13;
		ci.input.on('input', function (str) {
			str.should.equal("\n" + "Felix Haeusler" + "\n" + "Leo Fasbender" + "\n"
				 + "Stefan Kroener" + "\n" + "Mohamed Elrakaiby"); 
			done();
		});
		textarea.dispatchEvent(ev);
	});
	/*it('should handle pasting group of different tags', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		var tag = document.createElement("div");
		tag.textContent = "the div";
		textarea.appendChild(tag);
		tag = document.createElement("img");
		tag.src = "static/chatgrape/static/images/logo.svg";
		textarea.appendChild(tag);
		tag = document.createElement("br");
		textarea.appendChild(tag);
		tag = document.createTextNode("the text");
		textarea.appendChild(tag);
		tag = document.createElement("p");
		tag.textContent = "the paragraph";
		textarea.appendChild(tag);
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('keyup');
		ev.keyCode = 13;
		ci.input.on('input', function (str) {
			str.should.equal("\n" + "the div[IMG]" + "\n" + "static/chatgrape/static/images/logo.svg" +
				"\n" + "\n" + "the text" + "\n" + "the paragraph"); 
			done();
		});
		textarea.dispatchEvent(ev);
	});*/
	it('should handle writing html stuff', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		var div = document.createElement("div");
		div.textContent = "<p> test test </p><div id = \"check\">test div </div>";
		textarea.appendChild(div);
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('keyup');
		ev.keyCode = 13;
		ci.input.on('input', function (str) {
			str.should.equal("\n<p> test test </p><div id = \"check\">test div </div>"); 
			done();
		});
		textarea.dispatchEvent(ev);
	});
	it('should handle digeneration children nodes are handled', function (done){
		var ci = new ChatInput();
		var room = {foo: 'bar'};
		ci.setRoom(room);
		add(ci.el);
		var textarea = qs('.messageInput', ci.el);
		textarea.childNodes = textarea.childNodes || [];
		var fatherDiv = document.createElement("div");
		var childDiv = document.createElement("div");
		childDiv.textContent = "sentence 1";
		fatherDiv.childNodes = fatherDiv.childNodes || [];
		fatherDiv.appendChild(childDiv);
		childDiv = document.createElement("div");
		childDiv.textContent = "sentence 2";
		fatherDiv.appendChild(childDiv);
		textarea.appendChild(fatherDiv);
		var ev = document.createEvent('CustomEvent');
		ev.initCustomEvent('keyup');
		ev.keyCode = 13;
		ci.input.on('input', function (str) {
			str.should.equal("\nsentence 1\nsentence 2"); 
			done();
		});
		textarea.dispatchEvent(ev);
	});
});

