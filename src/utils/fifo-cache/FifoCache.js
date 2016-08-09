export default class FifoCache {
  constructor(maxSize) {
    this.maxSize = maxSize || 10000
    this.cache = Object.create(null)
    this.size = 0
  }

  put(key, value) {
    this.ensureSize()
    this.size++
    this.cache[key] = value
  }

  has(key) {
    return key in this.cache
  }

  get(key) {
    return this.cache[key]
  }

  del(key) {
    if (key in this.cache && delete this.cache[key]) {
      this.size--
      return true
    }
    return false
  }

  ensureSize() {
    // Remove first item.
    if (this.size < this.maxSize) return
    // We rely on correct order of keys in JS objects.
    for (const key in this.cache) { // eslint-disable-line guard-for-in
      this.del(key)
      return
    }
  }
}
