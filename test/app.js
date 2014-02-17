/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var WebSocketServer = require('ws').Server;

var lib = require('../');
var App = lib.App;
var models = lib.models;

describe('App', function () {
	beforeEach(function () {
		// clear the caches
		models.Line.clear();
		models.User.clear();
		models.Room.clear();
		models.Organization.clear();
	});
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
	describe('with user connected', function () {
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
						server.send(JSON.stringify([3, msg[1], result]));
					}
				});
			});
			app = new App({websocket: 'ws://localhost:8080'}, function (err, res) {
				res.user.id.should.eql(1);
				res.user.username.should.eql('foo');
				res.organizations[0].id.should.eql(1);
				done();
			});
		});
		afterEach(function () {
			server.close();
		});
		describe('when an organization is joined', function () {
			beforeEach(function (done) {
				var count = 0;
				server.on('message', function (msg) {
					count++;
					msg = JSON.parse(msg);
					if (count === 1) {
						msg[0].should.eql(2);
						msg[2].should.eql('http://domain/organizations/join');
						msg[3].should.eql(1);
						server.send(JSON.stringify([3, msg[1], null]));
					} else if (count === 2) {
						msg[0].should.eql(2);
						msg[2].should.eql('http://domain/organizations/get_organization');
						msg[3].should.eql(1);
						var result = {
							id: 1,
							name: 'foo',
							users: [{id: 1, username: 'foo', status: 16}, {id: 2, username: 'bar', status: 0}],
							rooms: [{id: 1, name: 'foo', users: [1, 2]}, {id: 2, name: 'bar', users: [2]}]
						};
						server.send(JSON.stringify([3, msg[1], result]));
					}
				});
				app.setOrganization(app.organizations[0], function (err, res) {
					res.should.be.an.instanceof(models.Organization);
					res.users.length.should.eql(2);
					res.users[0].id.should.eql(1);
					res.rooms.length.should.eql(2);
					var room = res.rooms[0];
					room.id.should.eql(1);
					room.users[0].should.equal(res.users[0]);
					room.users[1].should.equal(res.users[1]);
					done();
				});
			});
			it('should flag rooms the user is joined in', function () {
				var rooms = app.organization.rooms;
				rooms[0].joined.should.be.true;
				rooms[0].users[0].should.equal(app.user);
				rooms[1].joined.should.be.false;
			});
			it('should react to user status changes', function (done) {
				app.user.on('change status', function (val, prev) {
					prev.should.eql(16);
					val.should.eql(0);
					done();
				});
				server.send(JSON.stringify([8, 'http://domain/organization/1#status', {
					user: 1,
					status: 0
				}]));
			});
			it('should react to user data changes', function (done) {
				app.user.on('change lastName', function () {
					app.user.id.should.eql(1);
					app.user.username.should.eql('foobar');
					app.user.firstName.should.eql('foo');
					app.user.lastName.should.eql('bar');
					done();
				});
				server.send(JSON.stringify([8, 'http://domain/organization/1#update', {
					user: {
						id: 1,
						username: 'foobar',
						firstName: 'foo',
						lastName: 'bar'
					}
				}]));
			});
			it('should react to room data changes', function (done) {
				var room = app.organization.rooms[0];
				room.on('change slug', function () {
					room.id.should.eql(1);
					room.name.should.eql('name');
					room.slug.should.eql('slug');
					done();
				});
				server.send(JSON.stringify([8, 'http://domain/organization/1#update', {
					room: {
						id: 1,
						name: 'name',
						slug: 'slug'
					}
				}]));
			});
			it('should react to new rooms being created', function (done) {
				app.organization.rooms.on('add', function (room) {
					room.id.should.eql(3);
					room.name.should.eql('name');
					room.slug.should.eql('slug');
					done();
				});
				server.send(JSON.stringify([8, 'http://domain/organization/1#create', {
					room: {
						id: 3,
						name: 'name',
						slug: 'slug'
					}
				}]));
			});
			it('should publish new messages', function (done) {
				server.once('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/rooms/post');
					msg[3].should.eql(1);
					msg[4].should.eql('foobar');
					done();
				});
				app.publish(app.organization.rooms[0], 'foobar');
			});
			it('should join a room', function (done) {
				server.on('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/rooms/join');
					msg[3].should.eql(2);
					server.send(JSON.stringify([3, msg[1], null]));
				});
				var room = app.organization.rooms[1];
				room.joined.should.be.false;
				app.joinRoom(room, function () {
					room.joined.should.be.true;
					done();
				});
			});
			it('should leave a room', function (done) {
				server.on('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/rooms/leave');
					msg[3].should.eql(1);
					server.send(JSON.stringify([3, msg[1], null]));
				});
				var room = app.organization.rooms[0];
				room.joined.should.be.true;
				app.leaveRoom(room, function () {
					room.joined.should.be.false;
					done();
				});
			});
			it('should not double-join a room', function (done) {
				server.on('message', function () {
					throw new Error('not reached');
				});
				var room = app.organization.rooms[0];
				app.joinRoom(room, function () {
					done();
				});
			});
			it('should not leave a non-joined room', function (done) {
				server.on('message', function () {
					throw new Error('not reached');
				});
				var room = app.organization.rooms[1];
				app.leaveRoom(room, function () {
					done();
				});
			});
			it('should request some history', function (done) {
				server.on('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/rooms/get_history');
					msg[3].should.eql(1);
					var lines = [{
						id: 2,
						author: 2,
						text: 'foobar2',
						time: '2014-02-04T13:51:35.662Z'
					}, {
						id: 1,
						author: 1,
						text: 'foobar',
						time: '2014-02-04T13:51:34.662Z'
					}];
					server.send(JSON.stringify([3, msg[1], lines]));
				});
				var room = app.organization.rooms[0];
				var count = 0;
				room.history.on('add', function () {
					if (++count !== 2)
						return;
					room.history[0].id.should.eql(1);
					room.history[0].text.should.eql('foobar');
					room.history[0].time.getTime().should.eql(1391521894662);
					room.history[0].user.should.equal(room.users[0]);
					room.history[1].id.should.eql(2);
					room.history[1].text.should.eql('foobar2');
					room.history[1].time.getTime().should.eql(1391521895662);
					room.history[1].user.should.equal(room.users[1]);
					done();
				});
				app.getHistory(room);
			});
			it('should mark messages as read', function (done) {
				server.on('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/rooms/read');
					msg[3].should.eql(1);
					msg[4].should.eql(1);
					done();
				});
				var room = app.organization.rooms[0];
				var line = new models.Line({id: 1});
				app.setRead(room, line);
			});
			describe('when subscribed to a room', function () {
				beforeEach(function () {
					app.subscribeRooms();
				});
				it('should react to join notifications', function (done) {
					var room = app.organization.rooms[1];
					room.id.should.eql(2);
					var user = app.user;
					room.users.indexOf(user).should.eql(-1);
					room.users.on('add', function (obj) {
						obj.should.equal(user);
						done();
					});
					var msg = {
						user: 1
					};
					// subscribe to the other room as well
					app.subscribeRoom(app.organization.rooms[1]);
					server.send(JSON.stringify([8, 'http://domain/organization/1/room/2#join', msg]));
				});
				it('should react to leave notifications', function (done) {
					var room = app.organization.rooms[0];
					room.id.should.eql(1);
					var user = app.user;
					(!!~room.users.indexOf(user)).should.be.true;
					room.users.on('remove', function (obj) {
						obj.should.equal(user);
						done();
					});
					var msg = {
						user: 1
					};
					server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#leave', msg]));
				});
				it('should react to new messages', function (done) {
					app.organization.rooms[0].history.once('add', function (line, index) {
						index.should.eql(0);
						line.should.be.instanceof(models.Line);
						line.user.should.equal(app.user);
						line.text.should.eql('foobar');
						line.time.should.be.instanceof(Date);
						line.time.getTime().should.eql(1391521894662);
						done();
					});
					var msg = {
						id: 1,
						author: 1,
						text: 'foobar',
						time: '2014-02-04T13:51:34.662Z'
					};
					server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
				});
				it('should react to reading notifications', function (done) {
					app.organization.rooms[0].history.once('add', function (line, index) {
						index.should.eql(0);
						line.should.be.instanceof(models.Line);
						line.id.should.eql(1);
						line.user.should.equal(app.user);
						line.text.should.eql('foobar');
						line.time.should.be.instanceof(Date);
						line.time.getTime().should.eql(1391521894662);
						line.readers.length.should.eql(0);
						line.readers.once('add', function (reader, index) {
							reader.should.equal(models.User.get(2));
							index.should.eql(0);
							done();
						});
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#read', {
							message: 1,
							user: 2
						}]));
					});
					var msg = {
						id: 1,
						author: 1,
						text: 'foobar',
						time: '2014-02-04T13:51:34.662Z'
					};
					server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
				});
				it('should not add the current user to `readers`', function (done) {
					app.organization.rooms[0].history.once('add', function (line, index) {
						index.should.eql(0);
						line.should.be.instanceof(models.Line);
						line.id.should.eql(1);
						line.user.should.equal(app.user);
						line.text.should.eql('foobar');
						line.time.should.be.instanceof(Date);
						line.time.getTime().should.eql(1391521894662);
						line.readers.length.should.eql(0);
						line.readers.once('add', function () {
							throw new Error('not reached');
						});
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#read', {
							message: 1,
							user: 1
						}]));
						done();
					});
					var msg = {
						id: 1,
						author: 1,
						text: 'foobar',
						time: '2014-02-04T13:51:34.662Z'
					};
					server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
				});
				describe('unread count', function () {
					it('should increase when receiving a new message', function (done) {
						var room = app.organization.rooms[0];
						room.unread.should.eql(0);
						room.on('change unread', function (val) {
							val.should.eql(1);
							done();
						});
						var msg = {
							id: 1,
							author: 1,
							text: 'foobar',
							time: '2014-02-04T13:51:34.662Z'
						};
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
					});
					it('should decrease when marking messages as read', function (done) {
						var room = app.organization.rooms[0];
						room.unread.should.eql(0);
						room.history.on('add', function (line, index) {
							if (index !== 2)
								return;
							room.unread.should.eql(3);
							room.once('change unread', function (val) {
								val.should.eql(2);
							});
							app.setRead(room, room.history[0]);
							room.history[0].read.should.be.true;
							room.history[1].read.should.be.false;
							app.setRead(room, room.history[2]);
							room.unread.should.eql(0);
							room.history[0].read.should.be.true;
							room.history[1].read.should.be.true;
							room.history[2].read.should.be.true;
							done();
						});
						var msg = {
							id: 1,
							author: 1,
							text: 'foobar',
							time: '2014-02-04T13:51:34.662Z'
						};
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
						msg = {
							id: 2,
							author: 2,
							text: 'foobar2',
							time: '2014-02-04T13:51:34.662Z'
						};
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
						msg = {
							id: 3,
							author: 3,
							text: 'foobar3',
							time: '2014-02-04T13:51:34.662Z'
						};
						server.send(JSON.stringify([8, 'http://domain/organization/1/room/1#message', msg]));
					});
				});
			});
		});
	});
});
