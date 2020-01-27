// eslint-disable-next-line import/no-extraneous-dependencies
import expect from 'expect.js'
import hasJsProtocol from '..'

describe('hasJsProtocol', () => {
  it('should detect javascript protocol', () => {
    // eslint-disable-next-line no-script-url
    expect(hasJsProtocol('javascript:alert%28"xss"%29')).to.be(true)
  })
})
