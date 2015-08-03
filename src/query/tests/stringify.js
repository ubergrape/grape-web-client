import stringify from '../stringify'
import expect from 'expect.js'

describe('query', () => {
  describe('.stringify()', () => {
    it('should stringify with trigger only', () => {
      let str = stringify({trigger: '#'})
      expect(str).to.be('#')
    })

    it('should stringify with a search', () => {
      let str = stringify({
        trigger: '#',
        search: 'something'
      })
      expect(str).to.be('#something')
    })

    it('should stringify with a filter', () => {
      let str = stringify({
        trigger: '#',
        filters: ['filter0']
      })
      expect(str).to.be('#filter0:')
    })

    it('should stringify with filters', () => {
      let str = stringify({
        trigger: '#',
        filters: ['filter0', 'filter1']
      })
      expect(str).to.be('#filter0:filter1:')
    })

    it('should stringify with filter and search', () => {
      let str = stringify({
        trigger: '#',
        filters: ['filter0'],
        search: 'something'
      })
      expect(str).to.be('#filter0:something')
    })
  })
})
