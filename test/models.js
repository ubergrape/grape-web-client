/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var models = require('cg').App.models;
/*var should = */require('chaijs-chai').should();
//var happen = require('happen');

// the models are supposed to be `stupid` containers, so there is not much to test here

describe('Models', function () {
	describe('Room', function () {
		it('should have a list of users', function () {
			var room = new models.Room({id: 1, name: 'foo'});
			room.users.length.should.eql(0);
		});
		it('should have a history', function () {
			var room = new models.Room({id: 1, name: 'foo'});
			room.history.length.should.eql(0);
		});
	});
	describe('User', function () {
		it('should be cached by id', function () {
			var user = new models.User({id: 1, username: 'foo'});
			models.User.get(1).should.equal(user);
		});
	});
	describe('Chatline', function () {
		it('should have a user', function () {
			var user = new models.User({id: 1, username: 'foo'});
			var line = new models.Line({user: user});
			line.user.should.equal(user);
		});
	});
});
