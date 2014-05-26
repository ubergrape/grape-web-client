/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');

var RoomPopover = require('cg').UI.RoomPopover;

describe('RoomPopover', function () {
	var target = document.createElement('div');
	target.className = 'target';
	before(function () {
		document.body.appendChild(target);
	});
	after(function () {
		document.body.removeChild(target);
	});
	it('should take a list of items', function () {
		var d = new RoomPopover();
		d.setItems(emitter([emitter({id: 1, name: 'test', joined: false})]));
		qs('.item .name', d.el).textContent.should.eql('test');
	});
	it('should provide a redraw function', function () {
		var d = new RoomPopover();
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		qs('.item .name', d.el).textContent.should.eql('test');
		item.name = 'test2';
		d.redraw();
		qs('.item .name', d.el).textContent.should.eql('test2');
	});
	it('should provide a show/hide method', function () {
		var d = new RoomPopover();
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		d.el.className.should.include('hide');
		d.show(target);
		d.el.className.should.not.include('hide');
		d.hide();
		d.el.className.should.include('hide');
	});
	it.skip('should emit a selectitem event', function (done) {
		var d = new RoomPopover();
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		d.show(target);
		d.on('selectitem', function (r) {
			r.should.equal(item);
			d.hide();
			done();
		});
		trigger(qs('.toggle', d.el), 'click');
	});
});

