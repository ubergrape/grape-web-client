import expect from 'expect.js'
import {create} from '../'

describe('objects: Room', () => {
  const object = create('room', {
    id: '1',
    slug: 'slug',
    name: '[name]'
  })

  describe('Room#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be('[%5bname%5d](cg://chatgrape|room|1|/chat/slug)')
    })
  })
})
