/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

require('chaijs-chai').should();
var emitter = require('component-emitter');

var broker = require('cg').broker;

describe('broker', function () {
	it('should route joinroom events', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = {joinRoom: function (r) {
			r.should.equal(room);
			done();
		}};
		broker(ui, app);
		ui.emit('joinroom', room);
	});
	it('should route input events to publish', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = {publish: function (r, msg) {
			r.should.equal(room);
			msg.should.eql('some message');
			done();
		}};
		broker(ui, app);
		ui.emit('input', room, 'some message');
	});
	it('should route start/stop typing', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = {setTyping: function (r, on) {
			r.should.equal(room);
			if (on) {
				return ui.emit('stoptyping', room);
			}
			done();
		}};
		broker(ui, app);
		ui.emit('starttyping', room);
	});
	it('should route read events', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var message = {some: 'message'};
		var app = {setRead: function (r, msg) {
			r.should.equal(room);
			msg.should.equal(message);
			done();
		}};
		broker(ui, app);
		ui.emit('hasread', room, message);
	});
	it('should route history requests', function (done) {
		var room = {some: 'room'};
		var message = {some: 'message'};
		var ui = emitter({gotHistory: function (r, lines) {
			r.should.equal(room);
			lines[0].should.equal(message);
			done();
		}});
		var options = {some: 'options'};
		var app = {getHistory: function (r, opts, fn) {
			r.should.equal(room);
			opts.should.equal(options);
			fn([message]);
		}};
		broker(ui, app);
		ui.emit('needhistory', room, options);
	});
});
