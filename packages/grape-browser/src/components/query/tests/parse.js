import parse from '../parse'
import expect from 'expect.js'

describe('query', () => {
  describe('.parse()', () => {
    it('should parse empty query string', () => {
      const query = parse('')
      expect(query).to.eql({
        query: '',
        trigger: undefined,
        search: '',
      })
    })

    it('should parse query with trigger only', () => {
      const query = parse('#')
      expect(query).to.eql({
        query: '#',
        trigger: '#',
        search: '',
      })
    })

    it('should parse query with search', () => {
      const query = parse('#something')
      expect(query).to.eql({
        query: '#something',
        trigger: '#',
        search: 'something',
      })
    })
  })
})
