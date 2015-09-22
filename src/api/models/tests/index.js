var expect = require('expect.js');
var Chatline = require('../chatline');
var Emitter = require('emitter');
var Room = require('../room');
var Org = require('../organization');
var User = require('../user');

var room = new Room({
    'id': 1,
    'slug': 'foo'
});

describe('Models', function() {
    describe('Room', function () {
        it('should be possible to initialise', function () {
            expect(room).to.be.a(Room);
        });
        it('should be able to emit events', function () {
            expect(room).to.be.a(Emitter);
        });
        it('should have a history', function () {
            expect(room.history).to.be.empty();            
        });
        it('should have a search history', function () {
            expect(room.searchHistory).to.be.empty();            
        });
        it('should have users', function () {
            expect(room.users).to.be.empty();
        });
        it('should be possible to query by id', function () {
            expect(Room.get(1)).to.eql(room);
        });
    });
});