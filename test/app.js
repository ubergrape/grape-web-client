/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var WebSocketServer = require('ws').Server;

var lib = require('../');
var App = lib.App;
var models = lib.models;

describe('App', function () {
	var wss = new WebSocketServer({port: 8080});
	it('should create a connection to the wamp server', function (done) {
		wss.once('connection', function (ws) {
			ws.close();
			done();
		});
		new App({websocket: 'ws://localhost:8080'}, function () {});
	});
	it('should request the users profile', function (done) {
		wss.once('connection', function (ws) {
			ws.on('message', function (msg) {
				msg = JSON.parse(msg);
				msg[0].should.eql(2);
				msg[2].should.eql('http://domain/users/get_profile');
				ws.close();
				done();
			});
		});
		new App({websocket: 'ws://localhost:8080'}, function () {});
	});
	it('should request the organization details', function (done) {
		wss.once('connection', function (ws) {
			var count = 0;
			ws.on('message', function (msg) {
				count++;
				msg = JSON.parse(msg);
				var result;
				if (count === 1) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/users/get_profile');
					result = {
						id: 1,
						username: 'foo',
						organizations: [{id: 1, name: 'foo'}]
					};
					ws.send(JSON.stringify([3, msg[1], result]));
				} else if (count === 2) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/organizations/get_organization');
					msg[3].should.eql(1);
					ws.close();
					done();
				}
			});
		});
		new App({websocket: 'ws://localhost:8080'}, function () {});
	});
	it('should join the organization', function (done) {
		wss.once('connection', function (ws) {
			var count = 0;
			ws.on('message', function (msg) {
				count++;
				msg = JSON.parse(msg);
				var result;
				if (count === 1) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/users/get_profile');
					result = {
						id: 1,
						username: 'foo',
						organizations: [{id: 1, name: 'foo'}]
					};
					ws.send(JSON.stringify([3, msg[1], result]));
				} else if (count === 2) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/organizations/get_organization');
					msg[3].should.eql(1);
					result = {
						id: 1,
						name: 'foo',
						users: [{id: 1, username: 'foo'}],
						rooms: []
					};
					ws.send(JSON.stringify([3, msg[1], result]));
				} else if (count === 3) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/organizations/join');
					msg[3].should.eql(1);
					ws.send(JSON.stringify([3, msg[1], null]));
					ws.close();
				}
			});
		});
		new App({websocket: 'ws://localhost:8080'}, function (err, res) {
			res.user.id.should.eql(1);
			res.user.username.should.eql('foo');
			res.organizations.should.includeEql({id: 1, name: 'foo'});
			done();
		});
	});
	it('should subscribe to room notifications', function (done) {
		wss.once('connection', function (ws) {
			var count = 0;
			ws.on('message', function (msg) {
				count++;
				msg = JSON.parse(msg);
				var result;
				if (count === 1) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/users/get_profile');
					result = {
						id: 1,
						username: 'foo',
						organizations: [{id: 1, name: 'foo'}]
					};
					ws.send(JSON.stringify([3, msg[1], result]));
				} else if (count === 2) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/organizations/get_organization');
					msg[3].should.eql(1);
					result = {
						id: 1,
						name: 'foo',
						users: [{id: 1, username: 'foo'}],
						rooms: [{id: 1, name: 'foo'}]
					};
					ws.send(JSON.stringify([3, msg[1], result]));
				} else if (count === 3) {
					msg.should.eql([5, 'http://domain/organization/1/room/1#message']);
				} else if (count === 4) {
					msg.should.eql([5, 'http://domain/organization/1/room/1#reading']);
				} else if (count === 5) {
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/organizations/join');
					msg[3].should.eql(1);
					ws.send(JSON.stringify([3, msg[1], null]));
					ws.close();
				}
			});
		});
		new App({websocket: 'ws://localhost:8080'}, function (err, res) {
			res.user.id.should.eql(1);
			res.user.username.should.eql('foo');
			res.rooms[0].should.include({id: 1, name: 'foo'});
			res.organizations.should.includeEql({id: 1, name: 'foo'});
			done();
		});
	});
	describe('when the connection is established', function () {
		var server;
		var app;
		beforeEach(function (done) {
			wss.once('connection', function (ws) {
				server = ws;
				var count = 0;
				ws.on('message', function (msg) {
					count++;
					msg = JSON.parse(msg);
					var result;
					if (count === 1) {
						msg[0].should.eql(2);
						msg[2].should.eql('http://domain/users/get_profile');
						result = {
							id: 1,
							username: 'foo',
							organizations: [{id: 1, name: 'foo'}]
						};
						ws.send(JSON.stringify([3, msg[1], result]));
					} else if (count === 2) {
						msg[0].should.eql(2);
						msg[2].should.eql('http://domain/organizations/get_organization');
						msg[3].should.eql(1);
						result = {
							id: 1,
							name: 'foo',
							users: [{id: 1, username: 'foo'}],
							rooms: [{id: 1, name: 'foo'}]
						};
						ws.send(JSON.stringify([3, msg[1], result]));
					} else if (count === 3) {
						msg.should.eql([5, 'http://domain/organization/1/room/1#message']);
					} else if (count === 4) {
						msg.should.eql([5, 'http://domain/organization/1/room/1#reading']);
					} else if (count === 5) {
						msg[0].should.eql(2);
						msg[2].should.eql('http://domain/organizations/join');
						msg[3].should.eql(1);
						ws.send(JSON.stringify([3, msg[1], null]));
					}
				});
			});
			app = new App({websocket: 'ws://localhost:8080'}, function (err, res) {
				res.user.id.should.eql(1);
				res.user.username.should.eql('foo');
				res.rooms[0].should.include({id: 1, name: 'foo'});
				res.organizations.should.includeEql({id: 1, name: 'foo'});
				done();
			});
		});
		afterEach(function () {
			server.close();
		});
		it('should react to new messages', function (done) {
			app.rooms[0].history.once('add', function (line, index) {
				index.should.eql(0);
				line.should.be.instanceof(models.Line);
				line.user.should.equal(app.user);
				line.text.should.eql('foobar');
				done();
			});
			var msg = {
				user: 1,
				text: 'foobar'
			};
			server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
		});
		it('should react to reading notifications', function (done) {
			app.rooms[0].history.once('add', function (line, index) {
				index.should.eql(0);
				line.should.be.instanceof(models.Line);
				line.id.should.eql(1);
				line.user.should.equal(app.user);
				line.text.should.eql('foobar');
				line.readers.length.should.eql(0);
				line.readers.once('add', function (reader, index) {
					reader.should.equal(app.user);
					index.should.eql(0);
					done();
				});
				server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#reading', {
					line: 1,
					user: 1
				}]));
			});
			var msg = {
				id: 1,
				user: 1,
				text: 'foobar'
			};
			server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
		});
	});
});
