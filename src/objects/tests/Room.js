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
      expect(object.toHTML().replace(/\s/g, '')).to.be(`
        <a
          href="/chat/name"
          class="ac service-chatgrape type-chatgraperoom animate"
          data-object="[name](cg://chatgrape|room|1|/chat/slug)"
          tabindex="-1">
          @name
        </a>
      `.replace(/\s/g, ''))
    })
  })
})
