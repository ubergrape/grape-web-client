import expect from 'expect.js'
import {create} from '../'

describe('objects: User', () => {
  const object = create('user', {
    id: '1',
    username: 'username',
    name: '[name]'
  })

  describe('User#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be('[[name]](cg://chatgrape|user|1|/chat/@username)')
    })
  })
})
