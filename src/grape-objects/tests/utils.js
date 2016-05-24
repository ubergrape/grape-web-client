import expect from 'expect.js'
import {encodeMdLink, isGrapeUrl} from '../utils'

describe('grape-objects: utils', () => {
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

  describe('isGrapeUrl', () => {
    it('should detect cg protocol', () => {
      expect(isGrapeUrl('cg://something')).to.be(true)
      expect(isGrapeUrl('http://something')).to.be(false)
    })
  })
})
