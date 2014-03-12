/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
var should = require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');
var qs = require('component-query');

var Navigation = require('cg').UI.Navigation;

describe('Navigation', function () {
	// webkit wtf? https://code.google.com/p/chromium/issues/detail?id=120494
	var added;
	function add(el) {
		document.body.appendChild(el);
		added = el;
	}
	afterEach(function () {
		if (!added) return;
		added.parentNode.removeChild(added);
		added = null;
	});
	it('should should have a .el', function () {
		var nav = new Navigation();
		nav.el.should.be.an.instanceof(Element);
	});
	it('should allow setting sub lists', function () {
		var nav = new Navigation();
		nav.setLists({
			// XXX: otherwise the else branch is not covered
			//rooms: emitter([emitter({id: 1, name: 'test', joined: true})]),
			pms: emitter([emitter({id: 1, username: 'test', unread: 2})]),
			labels: emitter([emitter({id: 1, name: 'test', icon: 'github'})]),
		});
		//qs('.rooms li.item', nav.el).textContent.should.eql('test');
		qs('.pms li.item .unread', nav.el).textContent.should.eql('2');
		qs('.labels li.item i', nav.el).className.should.include('github');
	});
	it.skip('should emit proper events for each of the sub lists', function () {
		var nav = new Navigation();
		add(nav.el);
		nav.setLists({
			rooms: emitter([emitter({id: 1, name: 'test', joined: true})]),
			pms: emitter([emitter({id: 1, username: 'test', unread: 2})]),
			labels: emitter([emitter({id: 1, name: 'test', icon: 'github'})]),
		});
		var calls = 0;
		function addc() {calls++;}
		nav.on('addroom', addc);
		nav.on('addpm', addc);
		nav.on('addlabel', addc);
		trigger(qs('.rooms .additem', nav.el), 'click');
		trigger(qs('.pms .additem', nav.el), 'click');
		trigger(qs('.labels .additem', nav.el), 'click');
		calls.should.eql(3);
		calls = 0;
		nav.on('selectroom', addc);
		nav.on('selectpm', addc);
		nav.on('selectlabel', addc);
		trigger(qs('.rooms .icon', nav.el), 'click');
		trigger(qs('.pms .unread', nav.el), 'click');
		trigger(qs('.labels .label .fa', nav.el), 'click');
		calls.should.eql(3);
	});
	it('should allow selecting an item', function () {
		var nav = new Navigation();
		var item = emitter({id: 1, name: 'test', joined: true});
		nav.setLists({rooms: emitter([item])});
		should.not.exist(qs('li.item.selected', nav.el));
		nav.select('room', item);
		qs('li.item.selected', nav.el).textContent.should.eql('test');
	});
	it('should offer a redraw function', function () {
		var nav = new Navigation();
		var item = emitter({id: 1, name: 'test', joined: true});
		nav.setLists({rooms: emitter([item])});
		qs('.rooms li.item', nav.el).textContent.should.eql('test');
		item.name = 'test2';
		nav.redraw();
		qs('.rooms li.item', nav.el).textContent.should.eql('test2');
	});
});

