import shallowEqual from 'fbjs/lib/shallowEqual'
import FifoCache from '../../utils/fifo-cache/FifoCache'

/**
 * Cache for heights and elements, which is aware of user data.
 * It also does a shallowEqual check on each .setRows() call to ensure we
 * don't cache elements and hights for modified data.
 */
export default class RowsCache {
  constructor(rows = []) {
    this.cache = new FifoCache(5000)
    this.setRows(rows)
  }

  setRows(rows) {
    this.rows = rows
    // Once rows change, we need to compare data with the cached one,
    // because otheriwse, elements and heights are invalid.
    rows.forEach(this.update, this)
  }

  update(data) {
    const item = this.cache.get(data.id)
    if (!item) {
      this.cache.put(data.id, {data})
      return
    }

    if (!shallowEqual(data, item.data)) {
      this.cache.del(data.id)
      this.cache.put(data.id, {data})
    }
  }

  hasRowHeight(index) {
    const {id} = this.rows[index]
    const item = this.cache.get(id)
    return item.height !== undefined
  }

  getRowHeight(index) {
    const {id} = this.rows[index]
    const {height} = this.cache.get(id)
    return height
  }

  setRowHeight(index, height) {
    const {id} = this.rows[index]
    this.cache.get(id).height = height
  }

  hasElement(index) {
    const {id} = this.rows[index]
    const item = this.cache.get(id)
    return item.element !== undefined
  }

  getElement(index) {
    const {id} = this.rows[index]
    const {element} = this.cache.get(id)
    return element
  }

  setElement(index, element) {
    const {id} = this.rows[index]
    const item = this.cache.get(id)
    item.element = element
  }
}
