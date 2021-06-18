// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import { encodeMdLink, isGrapeUrl } from '../utils'

describe('grape-objects: utils', () => {
  describe('encodeMdLink', () => {
    it('encode parentheses', () => {
      const encoded = encodeMdLink('something_(bad)')
      expect(encoded).to.be('something_%28bad%29')
    })
    it('encode brackets', () => {
      const encoded = encodeMdLink('something_[bad]')
      expect(encoded).to.be('something_%5bbad%5d')
    })
    it('encode spaces', () => {
      const encoded = encodeMdLink('string with spaces')
      expect(encoded).to.be('string%20with%20spaces')
    })
    it('encode everything', () => {
      const encoded = encodeMdLink('cg://link with[spaces](etc)')
      expect(encoded).to.be('cg://link%20with%5bspaces%5d%28etc%29')
    })
  })

  describe('isGrapeUrl', () => {
    it('should detect cg protocol', () => {
      expect(isGrapeUrl('cg://something')).to.be(true)
      expect(isGrapeUrl('http://something')).to.be(false)
    })
  })
})
