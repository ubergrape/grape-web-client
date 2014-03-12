/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');

var RoomDialog = require('cg').UI.RoomDialog;

describe('RoomDialog', function () {
	it('should take a list of rooms', function () {
		var d = new RoomDialog();
		d.setRooms(emitter([emitter({id: 1, name: 'test', joined: false})]));
		qs('.room', d.el).textContent.should.eql('test');
	});
	it('should provide a redraw function', function () {
		var d = new RoomDialog();
		var room = emitter({id: 1, name: 'test', joined: false});
		d.setRooms(emitter([room]));
		qs('.room', d.el).textContent.should.eql('test');
		room.name = 'test2';
		d.redraw();
		qs('.room', d.el).textContent.should.eql('test2');
	});
	it('should provide a show/hide method', function () {
		var d = new RoomDialog();
		var room = emitter({id: 1, name: 'test', joined: false});
		d.setRooms(emitter([room]));
		d.el.className.should.include('hide');
		d.show();
		d.el.className.should.not.include('hide');
		d.hide();
		d.el.className.should.include('hide');
	});
	it('should emit a selectroom event', function (done) {
		var d = new RoomDialog();
		var room = emitter({id: 1, name: 'test', joined: false});
		d.setRooms(emitter([room]));
		d.show();
		d.on('selectroom', function (r) {
			r.should.equal(room);
			d.hide();
			done();
		});
		trigger(qs('.room', d.el), 'click');
	});
	it('should automatically close the dialog when the room changes `joined`', function (done) {
		var d = new RoomDialog();
		var room = emitter({id: 1, name: 'test', joined: false});
		d.setRooms(emitter([room]));
		d.show();
		d.on('selectroom', function (r) {
			r.should.equal(room);
			room.joined = true;
			room.emit('change joined');
			d.el.className.should.include('hide');
			done();
		});
		trigger(qs('.room', d.el), 'click');
	});
});

