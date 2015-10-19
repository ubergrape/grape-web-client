import expect from 'expect.js'
import {create} from '../'

describe('objects: User', () => {
  let object = create('user', {
    id: '1',
    username: 'username',
    name: 'name'
  })

  describe('User#toString', () => {
    it('should return correct md', () => {
      expect(object.toString()).to.be('[name](cg://chatgrape|user|1|/chat/@username)')
    })
  })

  describe('User#toHTML', () => {
    it('should return correct html', () => {
      expect(object.toHTML()).to.be(
        '<a ' +
          'tabindex="-1" ' +
          'href="/chat/@username" ' +
          'data-object="[name](cg://chatgrape|user|1|/chat/@username)" ' +
          'class="ac animate service-chatgrape type-chatgrapeuser">' +
          '@name' +
        '</a>'
      )
    })
  })
})
