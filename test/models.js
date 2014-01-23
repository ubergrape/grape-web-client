/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var WebSocketServer = require('ws').Server;


describe('Models', function () {
/*
	describe('Room', function () {
		var wss = new WebSocketServer({port: 8080});
		var server;
		var cg;
		var room;
		before(function (done) {
			wss.once('connection', function (ws) {
				server = ws;
				ws.send(JSON.stringify([0, "v59mbCGDXZ7WTyxB", 1, "Autobahn/0.5.1"]));
				done();
			});
			cg = require('../')({websocket: 'ws://localhost:8080'});
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
					message: {message: 'foo', user: 'foo'}
				}]));
			});
			room = new cg.models.Room({id: 1});
			room.history.once('add', function (item, index) {
				index.should.eql(0);
				item.message.should.eql('foo');
				room.history.once('add', function (item, index) {
					index.should.eql(1);
					item.message.should.eql('bar');
					done();
				});
				server.send(JSON.stringify([8, "http://cg.api/rooms/1", {
					type: 'message',
					message: {message: 'bar', user: 'foo'}
				}]));
			});
		});
	});
*/
});
