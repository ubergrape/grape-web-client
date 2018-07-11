import isChatUrl from '../../../utils/is-chat-url'

describe('Grapedown utils', () => {
  describe('isChatUrl', () => {
    it('should detect local links to chat', () => {
      expect(isChatUrl(window.location.href)).toBe(false)
      window.history.pushState(null, '', 'chat')
      expect(isChatUrl(window.location.href)).toBe(true)
    })
  })
})
