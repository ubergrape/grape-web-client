import FifoCache from '../../utils/fifo-cache/FifoCache'
import shallowEqual from 'fbjs/lib/shallowEqual'

export const cache = new FifoCache(10000)

/**
 * Cache for heights and elements, which is aware of user data.
 */
export default class RowsCache {
  constructor(rows) {
    this.setRows(rows)
  }

  setRows(rows) {
    // Clean up the cache if needed.
    rows.forEach(props => {
      const item = cache.get(props.id)
      if (item && !shallowEqual(item.props, props)) {
        cache.del(props.id)
      }
    })

    this.rows = rows
  }

  hasRowHeight(index) {
    const {id} = this.rows[index]
    const item = cache.get(id)
    return item !== undefined && item.height !== undefined
  }

  getRowHeight(index) {
    const {id} = this.rows[index]
    const {height} = cache.get(id)
    return height
  }

  setRowHeight(index, height) {
    const props = this.rows[index]
    cache.put(props.id, {height, props})
  }
}
