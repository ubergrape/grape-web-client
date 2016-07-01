import expect from 'expect.js'
import {isChatUrl} from '../utils'

describe('Grapedown utils', () => {
  describe('isChatUrl', () => {
    it('should detect local links to chat', () => {
      expect(isChatUrl(location.href)).to.be(false)
      history.pushState(null, '', 'chat')
      expect(isChatUrl(location.href)).to.be(true)
    })
  })
})
