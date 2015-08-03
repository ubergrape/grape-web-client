import parse from '../parse'
import expect from 'expect.js'

describe('query', () => {
  describe('.parse()', () => {
    it('should parse empty query string', () => {
      let query = parse('')
      expect(query).to.eql({
        query: '',
        key: '',
        trigger: undefined,
        filters: [],
        search: ''
      })
    })

    it('should parse query with trigger only', () => {
      let query = parse('#')
      expect(query).to.eql({
        query: '#',
        key: '',
        trigger: '#',
        filters: [],
        search: ''
      })
    })

    it('should parse query with search', () => {
      let query = parse('#something')
      expect(query).to.eql({
        query: '#something',
        key: 'something',
        trigger: '#',
        filters: [],
        search: 'something'
      })
    })

    it('should parse query with a filter', () => {
      let query = parse('#filter0:')
      expect(query).to.eql({
        query: '#filter0:',
        key: 'filter0:',
        trigger: '#',
        filters: ['filter0'],
        search: ''
      })
    })

    it('should parse query with filters', () => {
      let query = parse('#filter0:filter1:')
      expect(query).to.eql({
        query: '#filter0:filter1:',
        key: 'filter0:filter1:',
        trigger: '#',
        filters: ['filter0', 'filter1'],
        search: ''
      })
    })

    it('should parse query with filter and search', () => {
      let query = parse('#filter0:something')
      expect(query).to.eql({
        query: '#filter0:something',
        key: 'filter0:something',
        trigger: '#',
        filters: ['filter0'],
        search: 'something'
      })
    })
  })
})
