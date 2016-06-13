import {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'

/**
 * Determines if the specified start/stop range is visible based on the most recently rendered range.
 */
export function isRangeVisible({
  lastRenderedStartIndex,
  lastRenderedStopIndex,
  startIndex,
  stopIndex
}) {
  return !(startIndex > lastRenderedStopIndex || stopIndex < lastRenderedStartIndex)
}

/**
 * Higher-order component that manages lazy-loading for "infinite" data.
 * This component decorates a virtual component and just-in-time prefetches rows as a user scrolls.
 * It is intended as a convenience component; fork it if you'd like finer-grained control over data-loading.
 */
export default class InfiniteLoader extends Component {
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
     * Minimum number of rows to be loaded at a time.
     * This property can be used to batch requests to reduce HTTP requests.
     */
    minimumBatchSize: PropTypes.number.isRequired,

    /**
     * Threshold at which to pre-fetch data.
     * A threshold X means that data will start loading when a user scrolls within X rows.
     * This value defaults to 15.
     */
    threshold: PropTypes.number.isRequired
  }

  static defaultProps = {
    minimumBatchSize: 10,
    threshold: 15
  }

  constructor(props, context) {
    super(props, context)
    this.direction = 0
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onScroll = ({scrollTop}) => {
    if (this.scrollTop !== undefined) {
      this.direction = scrollTop - this.scrollTop
    }
    this.scrollTop = scrollTop

    if (scrollTop === 0 && this.range) {
      this.props.loadMoreRows(this.range)
    }
  }

  onRowsRendered = ({startIndex, stopIndex}) => {
    const {isRowLoaded, loadMoreRows, minimumBatchSize, threshold} = this.props

    this.lastRenderedStartIndex = startIndex
    this.lastRenderedStopIndex = stopIndex

    this.range = null

    if (this.direction >= 0) {
      // We are not close enough.
      if (isRowLoaded(stopIndex + threshold)) return

      this.range = {
        startIndex: stopIndex,
        stopIndex: stopIndex + minimumBatchSize
      }

      loadMoreRows(this.range)
    } else {
      // We are not close enough.
      if (isRowLoaded(startIndex - threshold)) return

      const nextStopIndex = startIndex > 0 ? startIndex - threshold : 0
      this.range = {
        startIndex: nextStopIndex - minimumBatchSize,
        stopIndex: nextStopIndex
      }
    }
  }

  render() {
    return this.props.children({
      onRowsRendered: this.onRowsRendered,
      onScroll: this.onScroll
    })
  }
}
