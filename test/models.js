/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var WebSocketServer = require('ws').Server;

// FIXME: the client prints every damn message, need to avoid that to not clutter the test view

describe('Models', function () {
	describe('Room', function () {
		var wss = new WebSocketServer({port: 8080});
		var server;
		var cg; // FIXME: late binding is a bit broken :-(
		var room;
		before(function (done) {
			wss.once('connection', function (ws) {
				server = ws;
				ws.send(JSON.stringify([0, "v59mbCGDXZ7WTyxB", 1, "Autobahn/0.5.1"]));
				done();
			});
			cg = require('../');
		});
		// beforeEach does not work, why?
		afterEach(function () {
			if (room)
				room.unsubscribe();
			room = null;
		});

		it('should automatically subscribe to events', function (done) {
			server.once('message', function (msg) {
				JSON.parse(msg).should.eql([5, "http://cg.api/rooms/1"]);
				done();
			});
			room = new cg.models.Room({id: 1});
		});
		it('should push new messages on the history when receiving them', function (done) {
			server.once('message', function (msg) {
				JSON.parse(msg).should.eql([5, "http://cg.api/rooms/1"]);
				server.send(JSON.stringify([8, "http://cg.api/rooms/1", {
					type: 'message',
					message: 'foo'
				}]));
			});
			room = new cg.models.Room({id: 1});
			room.history.once('add', function (item, index) {
				index.should.eql(0);
				item.should.eql('foo');
				room.history.once('add', function (item, index) {
					index.should.eql(1);
					item.should.eql('bar');
					room.history.should.include(['foo', 'bar']);
					done();
				});
				server.send(JSON.stringify([8, "http://cg.api/rooms/1", {
					type: 'message',
					message: 'bar'
				}]));
			});
		});
	});
});
