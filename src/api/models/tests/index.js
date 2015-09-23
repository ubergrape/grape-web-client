var expect = require('expect.js');
var Chatline = require('../chatline');
var Emitter = require('emitter');
var Room = require('../room');
var Org = require('../organization');
var User = require('../user');
var Chatline = require('../chatline');

var staticPath = CHATGRAPE_CONFIG.staticPath;
var user = new User({
    'id': 1,
    'username': 'alice'
});
var onlyInvitedUser = new User({
    'id': 2,
    'username': 'bob',
    'is_only_invited': true
});
var room = new Room({
    'id': 1,
    'slug': 'foo',
    'creator': 1
});
var org = new Org({
    'id': 1
});
var chatline = new Chatline({
    'author': {
        'type': 'user',
        'id': 1
    },
    'channel': 1
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
        it('should have a user as creator', function () {
            expect(room.creator).to.be.a(User);
        })
    });
    describe('User', function () {
        it('should be able to emit events', function () {
            expect(user).to.be.a(Emitter);
        });
        it('should be possible to initialise', function () {
            expect(user).to.be.a(User);
        });
        it('should be initialised with a default avatar', function () {
            expect(user.avatar).to.eql(staticPath + 'images/avatar.gif');
        });
        it('should be possible to query by id', function () {
            expect(User.get(1)).to.eql(user);
        });
    });
    describe('User who has not accepted invitation yet', function () {
        it('should be initiliased with a special default avatar', function () {
            expect(onlyInvitedUser.avatar).to.eql(staticPath + 'images/avatar_invited.gif');
        });
    });
    describe('Org', function () {
        it('should be able to emit events', function () {
            expect(org).to.be.a(Emitter);
        });
        it('should be initialised with a default logo', function () {
            expect(org.logo).to.eql(staticPath + 'images/cg-company.png');
        });
        it('should have rooms', function () {
            expect(org.rooms).to.be.empty();
        });
        it('should have users', function () {
            expect(org.users).to.be.empty();
        });
        it('should have pms', function () {
            expect(org.pms).to.be.empty();
        })
    });
    describe('Chatline', function () {
        it('should be able to emit events', function () {
            expect(chatline).to.be.a(Emitter);
        });
        it('should have a user as author', function () {
            expect(chatline.author).to.be.a(User)
        });
        it('should have a room as channel', function () {
            expect(chatline.channel).to.be.a(Room);
        });
    });
});