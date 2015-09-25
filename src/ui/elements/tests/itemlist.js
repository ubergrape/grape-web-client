var Emitter = require('emitter');
var ItemList = require('../itemlist');

var roomList = new ItemList({
    'template': 'roomlist.jade'
});

describe('ItemList', function () {
    it('should be able to emit events', function () {
        expect(roomList).to.be.a(Emitter);
    });
    it('should have an empty item list by default', function () {
        expect(roomList.items).to.be.empty();
    });
    it('should have no selected item by default', function () {
        expect(roomList.selected).to.be(null);
    });
    it('should be possible to redraw', function () {
        expect(roomList.redraw).to.be.a('function');
    });
    it('should accept items', function () {
        var rooms = [room, anotherRoom];
        roomList.setItems(rooms);
        expect(roomList.items).to.eql(rooms);
    });
    it('should offer a way to select items', function () {
        roomList.selectItem(room);
        expect(roomList.selected).to.eql(room);
    });
    it('should contain no more than one selected item at once', function () {
        roomList.selectItem(anotherRoom);
        expect(roomList.selected).to.be.an('object');
        expect(roomList.selected).to.be.eql(anotherRoom);
    });
    it('should be able to order its items', function () {
        roomList.order('slug');
        expect(roomList.items[0]).to.be.eql(anotherRoom);
    });
});