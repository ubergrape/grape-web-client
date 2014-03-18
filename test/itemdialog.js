/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
/*var should = */require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');

var ItemDialog = require('cg').UI.ItemDialog;

describe('ItemDialog (rooms template)', function () {
	var opts = {template: 'roomdialog', selector: '.item'};
	it('should take a list of items', function () {
		var d = new ItemDialog(opts);
		d.setItems(emitter([emitter({id: 1, name: 'test', joined: false})]));
		qs('.item', d.el).textContent.should.eql('test');
	});
	it('should provide a redraw function', function () {
		var d = new ItemDialog(opts);
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		qs('.item', d.el).textContent.should.eql('test');
		item.name = 'test2';
		d.redraw();
		qs('.item', d.el).textContent.should.eql('test2');
	});
	it('should provide a show/hide method', function () {
		var d = new ItemDialog(opts);
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		d.el.className.should.include('hide');
		d.show();
		d.el.className.should.not.include('hide');
		d.hide();
		d.el.className.should.include('hide');
	});
	it('should emit a selectitem event', function (done) {
		var d = new ItemDialog(opts);
		var item = emitter({id: 1, name: 'test', joined: false});
		d.setItems(emitter([item]));
		d.show();
		d.on('selectitem', function (r) {
			r.should.equal(item);
			d.hide();
			done();
		});
		trigger(qs('.item', d.el), 'click');
	});
});

