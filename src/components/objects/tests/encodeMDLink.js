import expect from 'expect.js'
import {encodeMdLink} from '../utils'

describe('objects:', () => {
  describe('encodeMdLink', () => {
    it('encode parentheses', () => {
      const encoded = encodeMdLink('something (bad)')
      expect(encoded).to.be('something %28bad%29')
    })
    it('encode brackets', () => {
      const encoded = encodeMdLink('something [bad]')
      expect(encoded).to.be('something %5bbad%5d')
    })
  })
})
