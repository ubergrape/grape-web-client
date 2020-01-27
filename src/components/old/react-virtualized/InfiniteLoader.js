import PropTypes from 'prop-types'
import { PureComponent } from 'react'
import { debounce } from 'lodash'

/**
 * Determines if the specified start/stop range is visible based on the most
 * recently rendered range.
 */
export function isRangeVisible({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex,
}) {
  return !(
    startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex
  )
}

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows
 * as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like
 * finer-grained control over data-loading.
 */
export default class InfiniteLoader extends PureComponent {
  static propTypes = {
    /**
     * Function respondible for rendering a virtualized component.
     * This function should implement the following signature:
     * ({onRowsRendered, onScroll}) => PropTypes.element
     */
    children: PropTypes.func.isRequired,

    /**
     * Function responsible for tracking the loaded state of each row.
     * It should implement the following signature: (index: number): boolean
     */
    isRowLoaded: PropTypes.func.isRequired,

    /**
     * Callback to be invoked when more rows must be loaded.
     * It should implement the following signature: ({startIndex, stopIndex})
     * It will be used to determine when to refresh the list with the newly-loaded data.
     * This callback may be called multiple times in reaction to a single scroll event.
     */
    loadMoreRows: PropTypes.func.isRequired,

    /**
     * Callback to be invoked when scroll position reaches the beginning.
     */
    onTouchTopEdge: PropTypes.func.isRequired,

    /**
     * Minimum number of rows to be loaded at a time.
     * This property can be used to batch requests to reduce HTTP requests.
     */
    minimumBatchSize: PropTypes.number.isRequired,

    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means that data will start loading when a user scrolls within X rows.
     * This value defaults to 15.
     */
    threshold: PropTypes.number.isRequired,
  }

  constructor(props, context) {
    super(props, context)
    this.direction = 0
  }

  onScrollStop = debounce(() => {
    const { threshold, loadMoreRows, isRowLoaded, onTouchTopEdge } = this.props
    if (this.direction === 0) return

    if (this.direction > 0) {
      // We are close enough.
      if (!isRowLoaded(this.stopIndex + threshold)) {
        loadMoreRows(this.getRange())
      }
      return
    }

    const range = this.getRange()

    if (range.startIndex < 0) {
      loadMoreRows(range)
      if (this.scrollTop <= 0) {
        onTouchTopEdge()
      }
    }
  }, 20)

  onScroll = ({ scrollTop }) => {
    // We don't care about overscroll.
    if (this.scrollTop !== undefined && scrollTop >= 0) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop
    this.onScrollStop()
  }

  onRowsRendered = ({ startIndex, stopIndex }) => {
    this.startIndex = startIndex
    this.stopIndex = stopIndex
  }

  getRange() {
    const { minimumBatchSize } = this.props

    if (this.direction >= 0) {
      return {
        startIndex: this.stopIndex,
        stopIndex: this.stopIndex + minimumBatchSize,
      }
    }

    return {
      startIndex: this.startIndex - minimumBatchSize,
      stopIndex: this.startIndex,
    }
  }

  render() {
    return this.props.children({
      onRowsRendered: this.onRowsRendered,
      onScroll: this.onScroll,
    })
  }
}
