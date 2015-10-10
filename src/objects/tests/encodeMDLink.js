import expect from 'expect.js'
import encodeMDLink from '../encodeMDLink'

describe('objects:', () => {
  describe('encodeMDLink', () => {
    it('encode paranthesis', () => {
      let encoded = encodeMDLink('something (bad)')
      expect(encoded).to.be('something %28bad%29')
    })
  })
})
