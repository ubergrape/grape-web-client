/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var should = require('chaijs-chai').should();

var Emitter = require('emitter');
var lib = require('cg');

var App = lib.App;
var models = lib.models;

function WsMock() {
	Emitter.call(this);
	var self = this;
	var server = this.server = new Emitter();
	this.send = function (data) {
		server.emit('message', data);
	};
	server.send = function (data) {
		self.emit('message', data);
	};
}
WsMock.prototype = Object.create(Emitter.prototype);

describe('App', function () {
	var server;
	var app;
	beforeEach(function (done) {
		// clear the caches
		models.Line.clear();
		models.User.clear();
		models.Room.clear();
		models.Organization.clear();

		// set up mock server
		var ws = new WsMock();
		server = ws.server;

		// and connect the app and select an organization
		// there are no tests yet for what happens when there is no
		// organization selected
		var count = 0;
		server.on('message', function (msg) {
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
			} else if (count === 2) {
				msg[0].should.eql(2);
				msg[2].should.eql('http://domain/organizations/join');
				msg[3].should.eql(1);
				server.send(JSON.stringify([3, msg[1], null]));
			} else if (count === 3) {
				msg[0].should.eql(2);
				msg[2].should.eql('http://domain/organizations/get_organization');
				msg[3].should.eql(1);
				result = {
					id: 1,
					name: 'foo',
					users: [
						{id: 1, username: 'foo', status: 16},
						{id: 2, username: 'bar', status: 0}],
					channels: [
						{id: 1, type: 'room', name: 'foo', users: [1, 2], unread: 0},
						{id: 2, type: 'room', name: 'bar', users: [2], unread: 0}]
				};
				server.send(JSON.stringify([3, msg[1], result]));
			}
		});
		app = new App({websocket: ws}, function (err, res) {
			res.user.id.should.eql(1);
			res.user.username.should.eql('foo');
			res.organizations[0].id.should.eql(1);
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
		server.send(JSON.stringify([8, 'http://domain/user#status', {
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
		server.send(JSON.stringify([8, 'http://domain/user#updated', {
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
		server.send(JSON.stringify([8, 'http://domain/channel#updated', {
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
		server.send(JSON.stringify([8, 'http://domain/channel#new', {
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
			msg[2].should.eql('http://domain/channels/post');
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
			msg[2].should.eql('http://domain/channels/join');
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
			msg[2].should.eql('http://domain/channels/leave');
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
			msg[2].should.eql('http://domain/channels/get_history');
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
			room.history[0].read.should.be.false;
			room.history[1].id.should.eql(2);
			room.history[1].text.should.eql('foobar2');
			room.history[1].time.getTime().should.eql(1391521895662);
			room.history[1].user.should.equal(room.users[1]);
			room.history[1].read.should.be.false;
			done();
		});
		app.getHistory(room);
	});
	it('should set history to read when last message is read', function (done) {
		server.on('message', function (msg) {
			msg = JSON.parse(msg);
			msg[0].should.eql(2);
			msg[2].should.eql('http://domain/channels/get_history');
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
		room.history.push(new models.Line({
			id: 3,
			author: 2,
			text: 'foobar3',
			time: '2014-02-04T13:51:36.662Z',
			read: true
		}));
		var count = 0;
		room.history.on('add', function () {
			if (++count !== 2)
				return;
			room.history[0].id.should.eql(1);
			room.history[0].text.should.eql('foobar');
			room.history[0].time.getTime().should.eql(1391521894662);
			room.history[0].user.should.equal(room.users[0]);
			room.history[0].read.should.be.true;
			room.history[1].id.should.eql(2);
			room.history[1].text.should.eql('foobar2');
			room.history[1].time.getTime().should.eql(1391521895662);
			room.history[1].user.should.equal(room.users[1]);
			room.history[1].read.should.be.true;
			done();
		});
		app.getHistory(room);
	});
	it('should mark messages as read', function (done) {
		server.on('message', function (msg) {
			msg = JSON.parse(msg);
			msg[0].should.eql(2);
			msg[2].should.eql('http://domain/channels/read');
			msg[3].should.eql(1);
			msg[4].should.eql(1);
			done();
		});
		var room = app.organization.rooms[0];
		var line = new models.Line({id: 1});
		// this needs to be in the history, otherwise it does not work
		room.history.push(line);
		app.setRead(room, line);
	});
	it('should set typing status', function (done) {
		server.on('message', function (msg) {
			msg = JSON.parse(msg);
			msg[0].should.eql(2);
			msg[2].should.eql('http://domain/channels/set_typing');
			msg[3].should.eql(1);
			msg[4].should.eql(true);
			done();
		});
		var room = app.organization.rooms[0];
		app.setTyping(room, true);
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
			user: 1,
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/channel#joined', msg]));
		// XXX: just for test coverage
		server.send(JSON.stringify([8, 'http://domain/channel#joined', msg]));
	});
	it('should react to typing notifications', function (done) {
		var room = app.organization.rooms[0];
		room.once('change typing', function () {
			room.typing[1].should.be.true;
			room.once('change typing', function () {
				should.not.exist(room.typing[1]);
				done();
			});
			var msg = {
				user: 1,
				typing: false,
				channel: room.id
			};
			server.send(JSON.stringify([8, 'http://domain/channel#typing', msg]));
			// XXX: just for test coverage:
			server.send(JSON.stringify([8, 'http://domain/channel#typing', msg]));
		});
		var msg = {
			user: 1,
			typing: true,
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/channel#typing', msg]));
		// XXX: just for test coverage:
		server.send(JSON.stringify([8, 'http://domain/channel#typing', msg]));
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
			user: 1,
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/channel#left', msg]));
		// XXX: just for test coverage
		server.send(JSON.stringify([8, 'http://domain/channel#left', msg]));
	});
	it('should react to new messages', function (done) {
		var room = app.organization.rooms[0];
		room.history.once('add', function (line, index) {
			index.should.eql(0);
			line.should.be.instanceof(models.Line);
			line.user.should.equal(app.user);
			line.text.should.eql('foobar');
			line.time.should.be.instanceof(Date);
			line.time.getTime().should.eql(1391521894662);
			line.read.should.be.false;	
			done();
		});
		var msg = {
			id: 1,
			author: 1,
			text: 'foobar',
			time: '2014-02-04T13:51:34.662Z',
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
	});
	it('should react to reading notifications', function (done) {
		var room = app.organization.rooms[0];
		room.history.once('add', function (line, index) {
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
				room.history.once('add', function (line2) {
					line2.readers.once('add', function (reader) {
						reader.should.equal(models.User.get(2));
						line.readers.length.should.eql(0);
						done();
					});
					server.send(JSON.stringify([8, 'http://domain/channel#read', {
						message: 2,
						user: 2,
						channel: room.id
					}]));
				});
				var msg = {
					id: 2,
					author: 1,
					text: 'foobar2',
					time: '2014-02-04T13:51:34.662Z',
					channel: room.id
				};
				server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
			});
			server.send(JSON.stringify([8, 'http://domain/channel#read', {
				message: 1,
				user: 2,
				channel: room.id
			}]));
		});
		var msg = {
			id: 1,
			author: 1,
			text: 'foobar',
			time: '2014-02-04T13:51:34.662Z',
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
	});
	it('should not add the current user to `readers`', function (done) {
		var room = app.organization.rooms[0];
		room.history.once('add', function (line, index) {
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
			server.send(JSON.stringify([8, 'http://domain/channel#read', {
				message: 1,
				user: 1,
				channel: room.id
			}]));
			done();
		});
		var msg = {
			id: 1,
			author: 1,
			text: 'foobar',
			time: '2014-02-04T13:51:34.662Z',
			channel: room.id
		};
		server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
	});
	describe('unread count', function () {
		function send() {
			var msg = {
				id: 1,
				author: 1,
				text: 'foobar',
				time: '2014-02-04T13:51:34.662Z',
				channel: 1
			};
			server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
			msg = {
				id: 2,
				author: 2,
				text: 'foobar2',
				time: '2014-02-04T13:51:34.662Z',
				channel: 1
			};
			server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
			msg = {
				id: 3,
				author: 3,
				text: 'foobar3',
				time: '2014-02-04T13:51:34.662Z',
				channel: 1
			};
			server.send(JSON.stringify([8, 'http://domain/message#new', msg]));
		}
		it('should increase when receiving a new message', function (done) {
			var room = app.organization.rooms[0];
			room.unread.should.eql(0);
			room.once('change unread', function (val) {
				val.should.eql(1);
				done();
			});
			send();
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
			send();
		});
		it('should not change unread count when already read', function (done) {
			var room = app.organization.rooms[0];
			room.unread.should.eql(0);
			room.history.on('add', function (line, index) {
				if (index !== 2)
					return;
				room.unread.should.eql(3);
				server.once('message', function (msg) {
					msg = JSON.parse(msg);
					msg[0].should.eql(2);
					msg[2].should.eql('http://domain/channels/read');
					msg[3].should.eql(1);
					msg[4].should.eql(2);
					server.on('message', function () {
						throw new Error('not reached');
					});
					room.unread.should.eql(1);
					app.setRead(room, room.history[0]);
					room.unread.should.eql(1);
					app.setRead(room, room.history[1]);
					room.unread.should.eql(1);
					done();
				});
				app.setRead(room, room.history[1]);
			});
			send();
		});
	});
});

