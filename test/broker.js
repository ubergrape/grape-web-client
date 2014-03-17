/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

require('chaijs-chai').should();
var emitter = require('component-emitter');

var broker = require('cg').broker;

describe('broker', function () {
	it('should route user change events', function (done) {
		var ui = emitter({setUser: function (u) {
			u.should.equal(user);
			done();
		}});
		var user = {some: 'user'};
		var app = emitter({});
		broker(ui, app);
		app.emit('change user', user);
	});
	it('should route organization/s change events', function (done) {
		var ui = emitter({setOrganizations: function (os) {
			os.should.equal(org);
			app.emit('change organization', org);
		}, setOrganization: function (o) {
			o.should.equal(org);
			done();
		}});
		var org = {some: 'organization'};
		var app = emitter({});
		broker(ui, app);
		app.emit('change organizations', org);
	});
	it('should route selectorganization events', function (done) {
		var ui = emitter({});
		var org = {some: 'organization'};
		var app = emitter({setOrganization: function (o) {
			o.should.equal(org);
			done();
		}});
		broker(ui, app);
		ui.emit('selectorganization', org);
	});
	it('should route joinroom events', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = emitter({joinRoom: function (r) {
			r.should.equal(room);
			done();
		}});
		broker(ui, app);
		ui.emit('joinroom', room);
	});
	it.skip('should route openpm events', function () {
		
	});
	it('should route input events to publish', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = emitter({publish: function (r, msg) {
			r.should.equal(room);
			msg.should.eql('some message');
			done();
		}});
		broker(ui, app);
		ui.emit('input', room, 'some message');
	});
	it('should route start/stop typing', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var app = emitter({setTyping: function (r, on) {
			r.should.equal(room);
			if (on) {
				return ui.emit('stoptyping', room);
			}
			done();
		}});
		broker(ui, app);
		ui.emit('starttyping', room);
	});
	it('should route read events', function (done) {
		var ui = emitter({});
		var room = {some: 'room'};
		var message = {some: 'message'};
		var app = emitter({setRead: function (r, msg) {
			r.should.equal(room);
			msg.should.equal(message);
			done();
		}});
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
		var app = emitter({getHistory: function (r, opts) {
			r.should.equal(room);
			opts.should.equal(options);
			this.emit('gothistory', r, [message]);
		}});
		broker(ui, app);
		ui.emit('needhistory', room, options);
	});
});
