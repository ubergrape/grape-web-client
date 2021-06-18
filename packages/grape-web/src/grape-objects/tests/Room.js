// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import { create } from '../'

describe('grape-objects: Room', () => {
  const object = create('room', {
    id: '1',
    slug: 'slug',
    name: '[name]',
  })

  describe('Room#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be(
        '[[name]](cg://chatgrape|room|1|/chat/slug)',
      )
    })
  })
})
