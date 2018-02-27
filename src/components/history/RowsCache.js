/* eslint-disable class-methods-use-this */
import CellMeasurerCache from 'react-virtualized/dist/es/CellMeasurer/CellMeasurerCache'
import shallowEqual from 'fbjs/lib/shallowEqual'

import FifoCache from '../../utils/fifo-cache/FifoCache'

const cache = new FifoCache(10000)

/**
 * Cache for heights and elements, which is aware of user data.
 */
export default class RowsCache extends CellMeasurerCache {
  setRows(rows) {
    // Clean up the cache if needed.
    rows.forEach((props) => {
      const item = cache.get(props.id)
      if (item && !shallowEqual(item.props, props)) {
        cache.del(props.id)
      }
    })

    this.rows = rows
  }

  rowHeight = ({index}) => {
    const {id} = this.rows[index] || {}
    const {height} = cache.get(id) || {}
    return height || null
  }

  set(index, columnIndex, width, height) {
    const props = this.rows[index]
    cache.put(props.id, {height, props})
  }

  has(index) {
    const props = this.rows[index]
    return props && cache.has(props.id)
  }

  clearAll() {
    cache.clear()
  }
}
