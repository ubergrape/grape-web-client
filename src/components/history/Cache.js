import shallowEqual from 'fbjs/lib/shallowEqual'

export default class Cache {
  constructor(rows) {
    // FIXME move caching to a separate class and use some FIFO cache with limited
    // size, use cacheSize prop.
    this.cache = {}
    this.rows = rows || []
  }

  setRows(rows) {
    this.rows = rows
  }

  hasRowHeight(index) {
    const {id} = this.rows[index]
    return this.cache[id] && this.cache[id].height !== undefined
  }

  getRowHeight(index) {
    const {id} = this.rows[index]
    return this.cache[id].height
  }

  setRowHeight(index, height) {
    const {id} = this.rows[index]
    if (!this.cache[id]) this.cache[id] = {}
    this.cache[id].height = height
  }

  hasElement(index) {
    const data = this.rows[index]
    const cache = this.cache[data.id]
    const hasElement = cache && cache.element !== undefined
    return hasElement && shallowEqual(data, cache.data)
  }

  getElement(index) {
    const {id} = this.rows[index]
    return this.cache[id].element
  }

  setElement(index, element) {
    const data = this.rows[index]
    const {id} = data
    if (!this.cache[id]) this.cache[id] = {}
    this.cache[id].element = element
    this.cache[id].data = data
  }
}
