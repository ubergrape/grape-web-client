/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');

var ChatHeader = require('cg').UI.ChatHeader;

describe('ChatHeader', function () {
	it('should have a .el', function () {
		var ch = new ChatHeader();
		ch.el.should.be.an.instanceof(Element);
	});
	it('should render the room name', function () {
		var ch = new ChatHeader();
		ch.setRoom(emitter({name: 'test', type: 'room', users: []}));
		qs('.roomname', ch.el).textContent.should.eql('test');
	});
	it('should render a list of all users in the room', function () {
		var ch = new ChatHeader();
		var user = {id: 1, username: 'test', status: 16};
		ch.setRoom(emitter({name: 'test', users: [user], typing: {}}));
		// FIXME: this test is too fragile
		qs('.user', ch.el).textContent.should.eql('test (16) ');
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
		ch.on('search', function (term) {
			term.should.eql('foobar');
			done();
		});
		trigger(qs('.search-submit', ch.el), 'click');
	});
});

