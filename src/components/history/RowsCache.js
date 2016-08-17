import FifoCache from '../../utils/fifo-cache/FifoCache'
import shallowEqual from 'fbjs/lib/shallowEqual'

const cache = new FifoCache(10000)

/**
 * Cache for heights and elements, which is aware of user data.
 */
export default class RowsCache {
  constructor(rows, getRowProps) {
    this.setRows(rows)
    this.getRowProps = getRowProps
  }

  setRows(rows) {
    this.rows = rows
    // Clean up the cache if needed.
    rows.forEach(({id}, index) => {
      const item = cache.get(id)
      if (item && !shallowEqual(item.props, this.getRowProps(index))) {
        cache.del(id)
      }
    })
  }

  hasRowHeight(index) {
    const {id} = this.rows[index]
    const item = cache.get(id)
    return item && item.height !== undefined
  }

  getRowHeight(index) {
    const {id} = this.rows[index]
    const {height} = cache.get(id)
    return height
  }

  setRowHeight(index, height) {
    const {id} = this.rows[index]
    cache.put(id, {
      height,
      props: this.getRowProps(index)
    })
  }
}
