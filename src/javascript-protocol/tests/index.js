import expect from 'expect.js'
import hasJsProtocol from '..'

describe('hasJsProtocol', () => {
  it('should detect javascript protocol', () => {
    expect(hasJsProtocol('javascript:alert%28"xss"%29')).to.be(true)
  })
})
