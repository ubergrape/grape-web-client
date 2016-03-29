import expect from 'expect.js'
import Emitter from 'emitter'
import Room from '../room'
import User from '../user'
import {room, user, onlyInvitedUser, chatLine, org} from '../../../tests/fixtures/'
import {staticPath} from 'conf'

describe('Models', () => {
  describe('Room', () => {
    it('should be possible to initialise', () => {
      expect(room).to.be.a(Room)
    })
    it('should be able to emit events', () => {
      expect(room).to.be.an(Emitter)
    })
    it('should have a history', () => {
      expect(room.history).to.be.empty()
    })
    it('should have a search history', () => {
      expect(room.searchHistory).to.be.empty()
    })
    it('should have users', () => {
      expect(room.users).to.be.empty()
    })
    it('should be possible to query by id', () => {
      expect(Room.get(1)).to.eql(room)
    })
    it('should have a user as creator', () => {
      expect(room.creator).to.be.a(User)
    })
  })
  describe('User', () => {
    it('should be able to emit events', () => {
      expect(user).to.be.an(Emitter)
    })
    it('should be possible to initialise', () => {
      expect(user).to.be.a(User)
    })
    it('should be initialised with a default avatar', () => {
      expect(user.avatar).to.contain(staticPath)
    })
    it('should be possible to query by id', () => {
      expect(User.get(1)).to.eql(user)
    })
  })
  describe('User who has not accepted invitation yet', () => {
    it('should be initiliased with a special default avatar', () => {
      expect(onlyInvitedUser.avatar).to.contain(staticPath)
    })
  })
  describe('Org', () => {
    it('should be able to emit events', () => {
      expect(org).to.be.an(Emitter)
    })
    it('should be initialised with a default logo', () => {
      expect(org.logo).to.contain(staticPath)
    })
    it('should have rooms', () => {
      expect(org.rooms).to.be.empty()
    })
    it('should have users', () => {
      expect(org.users).to.be.empty()
    })
    it('should have pms', () => {
      expect(org.pms).to.be.empty()
    })
  })
  describe('Chatline', () => {
    it('should be able to emit events', () => {
      expect(chatLine).to.be.an(Emitter)
    })
    it('should have a user as author', () => {
      expect(chatLine.author).to.be.a(User)
    })
    it('should have a room as channel', () => {
      expect(chatLine.channel).to.be.a(Room)
    })
  })
})
