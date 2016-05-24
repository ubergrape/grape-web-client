import expect from 'expect.js'
import {isGrapeUrl, isChatUrl} from '../utils'

describe('Grapedown utils', () => {
  describe('isGrapeUrl', () => {
    it('should detect cg protocol', () => {
      expect(isGrapeUrl('cg://something')).to.be(true)
      expect(isGrapeUrl('http://something')).to.be(false)
    })
  })
  describe('isChatUrl', () => {
    it('should detect local links to chat', () => {
      expect(isChatUrl(location.href)).to.be(false)
      history.pushState(null, '', 'chat')
      expect(isChatUrl(location.href)).to.be(true)
    })
  })
})
