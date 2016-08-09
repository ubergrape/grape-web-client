import expect from 'expect.js'
import FifoCache from '../FifoCache'

describe('FifoCache', () => {
  it('should put/get and have', () => {
    const cache = new FifoCache()
    expect(cache.has('a')).to.be(false)
    cache.put('a', 1)
    expect(cache.has('a')).to.be(true)
    expect(cache.get('a')).to.be(1)
  })

  it('should remove first enrty when size limit is reached', () => {
    const cache = new FifoCache(2)
    cache.put('a', 1)
    expect(cache.has('a')).to.be(true)
    cache.put('b', 2)
    expect(cache.has('a')).to.be(true)
    expect(cache.has('b')).to.be(true)
    cache.put('c', 3)
    expect(cache.has('a')).to.be(false)
    expect(cache.has('b')).to.be(true)
    expect(cache.has('c')).to.be(true)
  })

  it('should delete item', () => {
    const cache = new FifoCache()
    cache.put('a', 1)
    cache.del('a')
    expect(cache.has('a')).to.be(false)
  })
})
