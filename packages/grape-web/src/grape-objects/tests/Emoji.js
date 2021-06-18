// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import { create } from '../'

describe('grape-objects: Emoji', () => {
  const object = create('emoji', {
    shortname: 'shortname',
  })

  describe('Emoji#toString', () => {
    it('should return correct string', () => {
      expect(object.toString()).to.be('shortname')
    })
  })
})
