/* vim: set shiftwidth=2 tabstop=2 noexpandtab textwidth=80 wrap : */
"use strict";

var should = require('chaijs-chai').should();
var trigger = require('adamsanderson-trigger-event');

var RoomList = require('cg').UI.RoomList;

function qs(sel, ctx) {
	return (ctx || document).querySelector(sel);
}

describe('RoomList', function () {
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
		var rl = new RoomList();
		rl.el.should.be.an.instanceof(Element);
	});
	it('should render rooms', function () {
		var rl = new RoomList();
		rl.setRooms([{id: 1, name: 'test'}]);
		qs('li.room', rl.el).textContent.should.eql('test');
	});
	it('should re-render one room on change', function () {
		var rl = new RoomList();
		var room = {id: 1, name: 'test'};
		rl.setRooms([room]);
		qs('li.room', rl.el).textContent.should.eql('test');
		room.name = 'test2';
		rl.changedRoom(room);
		qs('li.room', rl.el).textContent.should.eql('test2');
	});
	it('should give a unread count', function () {
		var rl = new RoomList();
		var room = {id: 1, name: 'test'};
		rl.setRooms([room]);
		should.not.exist(qs('li.room .unread', rl.el));
		room.unread = 2;
		rl.changedRoom(room);
		qs('li.room .unread', rl.el).textContent.should.eql('2');
	});
	it('should mark a room as selected', function () {
		var rl = new RoomList();
		var room = {id: 1, name: 'test'};
		rl.setRooms([room]);
		should.not.exist(qs('li.room.selected', rl.el));
		rl.selectRoom(room);
		qs('li.room.selected', rl.el).textContent.should.eql('test');
	});
	it('should give private rooms a different icon', function () {
		var rl = new RoomList();
		var room = {id: 1, name: 'test'};
		rl.setRooms([room]);
		// TODO: this test might be fragile
		qs('li.room i', rl.el).className.should.not.include('fa-lock');
		room.private = true;
		rl.changedRoom(room);
		qs('li.room i', rl.el).className.should.include('fa-lock');
	});
	it('should emit a `addroom` when clicking the add room button', function (done) {
		var rl = new RoomList();
		add(rl.el);
		rl.on('addroom', function () {
			done();
		});
		var button = qs('button.addroom', rl.el);
		trigger(button, 'click');
	});
	it('should emit a `selectroom` when clicking on a room', function (done) {
		var rl = new RoomList();
		add(rl.el);
		var room = {id: 1, name: 'test'};
		rl.setRooms([room]);
		var roomEl = qs('li.room', rl.el);
		rl.on('selectroom', function (clicked) {
			clicked.should.equal(room);
			done();
		});
		trigger(roomEl, 'click');
	});
});

