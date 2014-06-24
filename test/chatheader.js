/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');
var template = require('template');

var ChatHeader = require('cg').UI.ChatHeader;

template.locals.user = {avatar: "", username:"test"};

describe('ChatHeader', function () {
	it('should have a .el', function () {
		var ch = new ChatHeader();
		ch.el.should.be.an.instanceof(Element);
	});
	it('should render the room name', function () {
		var ch = new ChatHeader();
		ch.setRoom(emitter({name: 'test', type: 'room', users: []}));
		qs('.room-name h1', ch.el).textContent.should.eql('test');
		qs('.room-name span.sml-nr', ch.el).textContent.should.eql('0');
	});
	it.skip('should render a list of all users in the room', function () {
		var ch = new ChatHeader();
		var user = {id: 1, username: 'test', status: 16};
		ch.setRoom(emitter({name: 'test', users: [user], typing: {}}));
		// FIXME: this test is too fragile
		// qs('.connected-users', ch.el).textContent.should.eql('1');
	});
	it('should provide a method to clear the search term', function () {
		var ch = new ChatHeader();
		qs('.search', ch.el).value = 'foobar';
		ch.clearSearch();
		qs('.search', ch.el).value.should.eql('');
	});
	it('should emit a `search` event when submitting the search form', function (done) {
		var ch = new ChatHeader();
		var input = qs('.search', ch.el);
		input.value = 'foobar';
		ch.on('searching', function (term) {
			term.should.eql('foobar');
			done();
		});
		trigger(qs('.search', ch.el), 'keyup');
	});
});

