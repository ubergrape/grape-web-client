import stringify from '../stringify'
import expect from 'expect.js'

describe('query', () => {
  describe('.stringify()', () => {
    it('should stringify with trigger only', () => {
      const str = stringify({ trigger: '#' })
      expect(str).to.be('#')
    })

    it('should stringify with a search', () => {
      const str = stringify({
        trigger: '#',
        search: 'something',
      })
      expect(str).to.be('#something')
    })
  })
})
