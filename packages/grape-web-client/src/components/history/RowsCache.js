/* eslint-disable class-methods-use-this */
import CellMeasurerCache from 'react-virtualized/dist/commonjs/CellMeasurer/CellMeasurerCache'
import isEqual from 'lodash/isEqual'
import keys from 'lodash/keys'
import filter from 'lodash/filter'
import every from 'lodash/every'

import FifoCache from '../../utils/fifo-cache/FifoCache'

const cache = new FifoCache(10000)

/**
 * We only want to check for actual data to be changed for the height cache of rows.
 * Therefor we filter out all functions which make the comparison resilient to structural changes
 * e.g. a property gets added to the props.
 *
 * It assumes both elements have the same properties.
 */
export const equalPropsData = (a, b) => {
  // The keys can be different in some cases e.g. isExpanded is not attached at all and
  // then set to true.
  if (!isEqual(keys(a), keys(b))) {
    return false
  }
  const dataProperties = filter(keys(a), key => typeof a[key] !== 'function')
  return every(dataProperties, key => isEqual(a[key], b[key]))
}

/**
 * Cache for heights and elements, which is aware of user data.
 */
export default class RowsCache extends CellMeasurerCache {
  setRows(rows) {
    // Clean up the cache if needed.
    rows.forEach(props => {
      const item = cache.get(props.id)
      // The purpose with this comparison is to reset as little rows in the
      // cache as possible since react-virtualized in version 9 had troubles
      // keeping the scroll position in case a lot of rows have to be-calculated.
      if (item && !equalPropsData(item.props, props)) {
        cache.del(props.id)
      }
    })

    this.rows = rows
  }

  rowHeight = ({ index }) => {
    const { id } = this.rows[index] || {}
    const { height } = cache.get(id) || {}
    return height || null
  }

  set(index, columnIndex, width, height) {
    const props = this.rows[index]
    cache.put(props.id, { height, props })
  }

  has(index) {
    const props = this.rows[index]
    return props && cache.has(props.id)
  }

  clearAll() {
    cache.clear()
  }
}
