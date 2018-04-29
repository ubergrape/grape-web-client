import FifoCache from '../FifoCache'

describe('FifoCache', () => {
  it('should put/get and have', () => {
    const cache = new FifoCache()
    expect(cache.has('a')).toBe(false)
    cache.put('a', 1)
    expect(cache.has('a')).toBe(true)
    expect(cache.get('a')).toBe(1)
    expect(cache.size).toBe(1)
  })

  it('should remove first enrty when size limit is reached', () => {
    const cache = new FifoCache(2)
    cache.put('a', 1)
    expect(cache.has('a')).toBe(true)
    cache.put('b', 2)
    expect(cache.has('a')).toBe(true)
    expect(cache.has('b')).toBe(true)
    expect(cache.size).toBe(2)
    cache.put('c', 3)
    expect(cache.has('a')).toBe(false)
    expect(cache.has('b')).toBe(true)
    expect(cache.has('c')).toBe(true)
    expect(cache.size).toBe(2)
  })

  it('should delete item', () => {
    const cache = new FifoCache()
    cache.put('a', 1)
    cache.del('a')
    expect(cache.has('a')).toBe(false)
  })

  it('should clear cache', () => {
    const cache = new FifoCache()
    cache.put('a', 1)
    cache.clear()
    expect(cache.has('a')).toBe(false)
    expect(cache.size).toBe(0)
  })
})
