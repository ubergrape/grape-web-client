import { isChatUrl } from '../utils'

describe('Grapedown utils', () => {
  describe('isChatUrl', () => {
    it('should detect local links to chat', () => {
      expect(isChatUrl(global.location.href)).toBe(false)
      global.history.pushState(null, '', 'chat')
      expect(isChatUrl(global.location.href)).toBe(true)
    })
  })
})
