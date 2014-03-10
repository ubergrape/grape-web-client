/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var emitter = require('component-emitter');
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
		il.setItems(emitter([emitter({id: 1, name: 'test', joined: true})]));
		qs('li.item', il.el).textContent.should.eql('test');
	});
	it('should react to item additions', function () {
		var il = new ItemList(opts);
		var items = emitter([]);
		il.setItems(items);
		should.not.exist(qs('li.item', il.el));
		var item = emitter({id: 1, name: 'test', joined: true});
		items.push(item);
		items.emit('change');
		items.emit('add', item);
		qs('li.item', il.el).textContent.should.eql('test');
		item.name = 'test2';
		item.emit('change');
		item.emit('change name');
		qs('li.item', il.el).textContent.should.eql('test2');
	});
	it('should correctly unbind removed items', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		var item2 = emitter({id: 2, name: 'test2', joined: true});
		var items = emitter([item, item2]);
		il.setItems(items);
		qs('li.item', il.el).textContent.should.eql('test');
		items.pop();
		items.emit('change');
		items.emit('remove', item2);
		qs('li.item', il.el).textContent.should.eql('test');
		item.name = 'test2';
		item2.emit('change');
		item2.emit('change name');
		qs('li.item', il.el).textContent.should.eql('test');
	});
	it('should correctly unbind the item list and its items', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		var items = emitter([item]);
		il.setItems(items);
		var item2 = emitter({id: 2, name: 'test2', joined: true});
		il.setItems(emitter([item2]));
		qs('li.item', il.el).textContent.should.eql('test2');
		item2.name = 'test';
		items.emit('change');
		item.emit('change');
		item.emit('change name');
		qs('li.item', il.el).textContent.should.eql('test2');
	});
	it('should re-render one item on change', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		qs('li.item', il.el).textContent.should.eql('test');
		item.name = 'test2';
		item.emit('change');
		item.emit('change name');
		qs('li.item', il.el).textContent.should.eql('test2');
	});
	it('should offer a manuel redraw function', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		qs('li.item', il.el).textContent.should.eql('test');
		item.name = 'test2';
		il.redraw();
		qs('li.item', il.el).textContent.should.eql('test2');
	});
	it('should give a unread count', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		should.not.exist(qs('li.item .unread', il.el));
		item.unread = 2;
		item.emit('change');
		item.emit('change unread');
		qs('li.item .unread', il.el).textContent.should.eql('2');
	});
	it('should mark a item as selected', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		should.not.exist(qs('li.item.selected', il.el));
		il.selectItem(item);
		qs('li.item.selected', il.el).textContent.should.eql('test');
	});
	it('should give private items a different icon', function () {
		var il = new ItemList(opts);
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		// TODO: this test might be fragile
		qs('li.item i', il.el).className.should.not.include('fa-lock');
		item.private = true;
		item.emit('change');
		item.emit('change private');
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
		var item = emitter({id: 1, name: 'test', joined: true});
		il.setItems(emitter([item]));
		var itemEl = qs('li.item .icon', il.el);
		il.on('selectitem', function (clicked) {
			clicked.should.equal(item);
			done();
		});
		trigger(itemEl, 'click');
	});
});

