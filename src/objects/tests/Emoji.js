import expect from 'expect.js'
import {create} from '../'

describe('objects: Emoji', () => {
  let object = create('emoji', {
    shortname: 'shortname'
  })

  describe('Emoji#toString', () => {
    it('should return correct string', () => {
      expect(object.toString()).to.be('shortname')
    })
  })

  describe('Emoji#toHTML', () => {
    it('should return shortname', () => {
      expect(object.toHTML()).to.be('shortname')
    })
  })
})
