import expect from 'expect.js'
import {create} from '../'

describe('objects: Room', () => {
  let object = create('room', {
    id: '1',
    slug: 'slug',
    name: 'name'
  })

  describe('Room#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be('[name](cg://chatgrape|room|1|/chat/slug)')
    })
  })

  describe('Room#toHTML', () => {
    it('should return correct html', () => {
      expect(object.toHTML()).to.be(
        '<a ' +
          'tabindex="-1" ' +
          'href="/chat/name" ' +
          'data-object="[name](cg://chatgrape|room|1|/chat/slug)" ' +
          'class="ac animate service-chatgrape type-chatgraperoom">' +
          '@name' +
        '</a>'
      )
    })
  })
})
