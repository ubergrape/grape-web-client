import stringify from '../stringify'
import expect from 'expect.js'

describe('query', () => {
  describe('.stringify()', () => {
    it('should stringify with trigger only', () => {
      const str = stringify({trigger: '#'})
      expect(str).to.be('#')
    })

    it('should stringify with a search', () => {
      const str = stringify({
        trigger: '#',
        search: 'something'
      })
      expect(str).to.be('#something')
    })

    it('should stringify with a filter', () => {
      const str = stringify({
        trigger: '#',
        filters: ['filter0']
      })
      expect(str).to.be('#filter0:')
    })

    it('should stringify with filters', () => {
      const str = stringify({
        trigger: '#',
        filters: ['filter0', 'filter1']
      })
      expect(str).to.be('#filter0:filter1:')
    })

    it('should stringify with filter and search', () => {
      const str = stringify({
        trigger: '#',
        filters: ['filter0'],
        search: 'something'
      })
      expect(str).to.be('#filter0:something')
    })
  })
})
