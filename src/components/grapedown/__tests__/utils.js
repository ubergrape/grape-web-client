import { isChatUrl } from '../utils'

describe('Grapedown utils', () => {
  describe('isChatUrl', () => {
    it('should detect local links to chat', () => {
      expect(isChatUrl(location.href)).toBe(false)
      history.pushState(null, '', 'chat')
      expect(isChatUrl(location.href)).toBe(true)
    })
  })
})
