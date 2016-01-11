import expect from 'expect.js'
import {encodeMDLink} from '../utils'

describe('objects:', () => {
  describe('encodeMDLink', () => {
    it('encode paranthesis', () => {
      const encoded = encodeMDLink('something (bad)')
      expect(encoded).to.be('something %28bad%29')
    })
  })
})
