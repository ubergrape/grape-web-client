let expect = require('expect.js')
let Emitter = require('emitter')
let Room = require('../room')
let User = require('../user')
let fixtures = require('../../../../fixtures')
let room = fixtures.room
let user = fixtures.user
let onlyInvitedUser = fixtures.onlyInvitedUser
let chatLine = fixtures.chatLine
let org = fixtures.org
let staticPath = require('conf').staticPath

describe('Models', function() {
    describe('Room', function() {
        it('should be possible to initialise', function() {
            expect(room).to.be.a(Room)
        })
        it('should be able to emit events', function() {
            expect(room).to.be.an(Emitter)
        })
        it('should have a history', function() {
            expect(room.history).to.be.empty()
        })
        it('should have a search history', function() {
            expect(room.searchHistory).to.be.empty()
        })
        it('should have users', function() {
            expect(room.users).to.be.empty()
        })
        it('should be possible to query by id', function() {
            expect(Room.get(1)).to.eql(room)
        })
        it('should have a user as creator', function() {
            expect(room.creator).to.be.a(User)
        })
    })
    describe('User', function() {
        it('should be able to emit events', function() {
            expect(user).to.be.an(Emitter)
        })
        it('should be possible to initialise', function() {
            expect(user).to.be.a(User)
        })
        it('should be initialised with a default avatar', function() {
            expect(user.avatar).to.contain(staticPath)
        })
        it('should be possible to query by id', function() {
            expect(User.get(1)).to.eql(user)
        })
    })
    describe('User who has not accepted invitation yet', function() {
        it('should be initiliased with a special default avatar', function() {
            expect(onlyInvitedUser.avatar).to.contain(staticPath)
        })
    })
    describe('Org', function() {
        it('should be able to emit events', function() {
            expect(org).to.be.an(Emitter)
        })
        it('should be initialised with a default logo', function() {
            expect(org.logo).to.contain(staticPath)
        })
        it('should have rooms', function() {
            expect(org.rooms).to.be.empty()
        })
        it('should have users', function() {
            expect(org.users).to.be.empty()
        })
        it('should have pms', function() {
            expect(org.pms).to.be.empty()
        })
    })
    describe('Chatline', function() {
        it('should be able to emit events', function() {
            expect(chatLine).to.be.an(Emitter)
        })
        it('should have a user as author', function() {
            expect(chatLine.author).to.be.a(User)
        })
        it('should have a room as channel', function() {
            expect(chatLine.channel).to.be.a(Room)
        })
    })
})
