/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var should = require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');

var ItemList = require('cg').UI.ItemList;

function qs(sel, ctx) {
	return (ctx || document).querySelector(sel);
}

describe('ItemList (Rooms/PMs)', function () {
	var opts = {template: 'roomlist'};
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
	it('should have a .el', function () {
		var il = new ItemList(opts);
		il.el.should.be.an.instanceof(Element);
	});
	it('should render items', function () {
		var il = new ItemList(opts);
		il.setItems([{id: 1, name: 'test'}]);
		qs('li.item', il.el).textContent.should.eql('test');
	});
	it('should re-render one item on change', function () {
		var il = new ItemList(opts);
		var item = {id: 1, name: 'test'};
		il.setItems([item]);
		qs('li.item', il.el).textContent.should.eql('test');
		item.name = 'test2';
		il.changedItem(item);
		qs('li.item', il.el).textContent.should.eql('test2');
	});
	it('should give a unread count', function () {
		var il = new ItemList(opts);
		var item = {id: 1, name: 'test'};
		il.setItems([item]);
		should.not.exist(qs('li.item .unread', il.el));
		item.unread = 2;
		il.changedItem(item);
		qs('li.item .unread', il.el).textContent.should.eql('2');
	});
	it('should mark a item as selected', function () {
		var il = new ItemList(opts);
		var item = {id: 1, name: 'test'};
		il.setItems([item]);
		should.not.exist(qs('li.item.selected', il.el));
		il.selectItem(item);
		qs('li.item.selected', il.el).textContent.should.eql('test');
	});
	it('should give private items a different icon', function () {
		var il = new ItemList(opts);
		var item = {id: 1, name: 'test'};
		il.setItems([item]);
		// TODO: this test might be fragile
		qs('li.item i', il.el).className.should.not.include('fa-lock');
		item.private = true;
		il.changedItem(item);
		qs('li.item i', il.el).className.should.include('fa-lock');
	});
	it('should emit a `additem` when clicking the add item button', function (done) {
		var il = new ItemList(opts);
		add(il.el);
		il.on('additem', function () {
			done();
		});
		var button = qs('button.additem', il.el);
		trigger(button, 'click');
	});
	it('should emit a `selectitem` when clicking on a item', function (done) {
		var il = new ItemList(opts);
		add(il.el);
		var item = {id: 1, name: 'test'};
		il.setItems([item]);
		var itemEl = qs('li.item .icon', il.el);
		il.on('selectitem', function (clicked) {
			clicked.should.equal(item);
			done();
		});
		trigger(itemEl, 'click');
	});
});

