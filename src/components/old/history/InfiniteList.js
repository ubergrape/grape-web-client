import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import List from 'react-virtualized/dist/commonjs/List'
import injectSheet from 'grape-web/lib/jss'
import { noop, debounce, findIndex } from 'lodash'
import { spacer } from 'grape-theme/dist/sizes'
import { FormattedMessage } from 'react-intl'

import { reactVirtualizedRecalculationDelay } from '../../../constants/delays'
import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'

import { lastRowBottomSpace } from './rowTheme'
import RowsCache from './RowsCache'

class InfiniteList extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func,
    scrollToAlignment: PropTypes.string,
    loadedNewerMessage: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    scrollTo: null,
    onRowsRendered: noop,
    scrollToAlignment: null,
  }

  state = { scrollLocked: false }

  componentDidMount() {
    this.cache.setRows(this.props.rows)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.cache.setRows(nextProps.rows)
      this.list.recomputeRowHeights()
    }
  }

  onRefList = ref => {
    this.list = ref
  }

  onRowsRendered = ({ startIndex, stopIndex }) => {
    if (this.state.scrollLocked && this.didRenderLastRow) {
      // When the last row was rendered while we are in phase where react-virtualize
      // recalculates the user was either at the bottom or very close
      // to the bottom of the chat before recalculation started. Jumping to the last
      // row was the best experience in this case.
      this.scrollToRow(this.props.rows.length - 1)
    } else if (!this.state.scrollLocked) {
      this.idOfMessageToBeFocusedAfterResize = this.props.rows[startIndex].id
      this.didRenderLastRow = this.props.rows.length === stopIndex + 1
    }
  }

  onResizeViewport = ({ width }) => {
    // When container gets resized, we can forget all cached heights.
    // Compare additionally with a locally cached width, because
    // this function is called in some cases even when width has not changed.
    if (this.prevWidth !== undefined && this.prevWidth !== width) {
      this.setState({ scrollLocked: true })
      // The width can be 0 in case the search is opened on a screen with a little
      // width. We prevent re-calculations here since react-virtualized can't
      // properly deal with a width 0 and would mess up the scroll position.
      if (width !== 0) {
        this.cache.clearAll()
        this.list.recomputeRowHeights()
        // if this.didRenderLastRow is active during the scrollLocked phase
        // this.onRowsRendered will make sure to always stick to the bottom
        // and we won't show the recalculate overlay
        //
        // this stick to the bottom case is the most common one and that's
        // why we decided to make this optimization for it
        if (this.didRenderLastRow) {
          this.debouncedReleaseLockState()
        } else {
          this.debouncedScrollToRowBeforeResize()
        }
      }
    }
    this.prevWidth = width
  }

  debouncedScrollToRowBeforeResize = debounce(() => {
    const newIndex = findIndex(
      this.props.rows,
      item => item.id === this.idOfMessageToBeFocusedAfterResize,
    )
    this.list.scrollToRow(newIndex)
    this.setState({ scrollLocked: false })
  }, reactVirtualizedRecalculationDelay)

  debouncedReleaseLockState = debounce(() => {
    this.setState({ scrollLocked: false })
  }, reactVirtualizedRecalculationDelay)

  cache = new RowsCache({ fixedWidth: true })

  isRowLoaded = index => Boolean(this.props.rows[index])

  scrollToRow = index => {
    this.list.scrollToRow(index)
  }

  scrollToPosition = value => {
    this.list.scrollToPosition(value)
  }

  renderRow = ({ index, key, parent, style }) => (
    <CellMeasurer
      cache={this.cache}
      parent={parent}
      columnIndex={0}
      key={key}
      rowIndex={index}
    >
      {this.props.renderRow({ index, key, style })}
    </CellMeasurer>
  )

  render() {
    const {
      onRowsRendered,
      onLoadMore,
      onTouchTopEdge,
      onScroll,
      scrollTo,
      rows,
      minimumBatchSize,
      classes,
      scrollToAlignment,
      loadedNewerMessage,
    } = this.props

    const scrollToRow = scrollTo ? findIndex(rows, { id: scrollTo }) : undefined
    const renderScrollLockOverlay =
      this.state.scrollLocked && !this.didRenderLastRow

    return (
      <div className={classes.wrapper}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={onLoadMore}
          onTouchTopEdge={onTouchTopEdge}
          threshold={5}
          minimumBatchSize={minimumBatchSize}
        >
          {({
            onRowsRendered: onRowsRenderedInInfiniteLoader,
            onScroll: onScrollInInfiniteLoader,
          }) => (
            <AutoSizer onResize={this.onResizeViewport}>
              {({ width, height }) => (
                <AutoScroll
                  rows={rows}
                  height={height}
                  scrollToIndex={scrollToRow}
                  scrollToAlignment={scrollToAlignment}
                  minEndThreshold={lastRowBottomSpace}
                  scrollToPosition={this.scrollToPosition}
                  loadedNewerMessage={loadedNewerMessage}
                >
                  {({
                    onScroll: onScrollInAutoScroll,
                    scrollToAlignment: scrollToAlignmentInAutoScroll,
                    scrollToIndex,
                    onRowsRendered: onRowsRenderedInAutoScroll,
                  }) => (
                    <List
                      deferredMeasurementCache={this.cache}
                      className={classes.grid}
                      scrollToIndex={scrollToIndex}
                      scrollToAlignment={scrollToAlignmentInAutoScroll}
                      onRowsRendered={params => {
                        this.onRowsRendered(params)
                        onRowsRenderedInAutoScroll(params)
                        onRowsRenderedInInfiniteLoader(params)
                        onRowsRendered(params)
                      }}
                      onScroll={params => {
                        onScroll(params)
                        onScrollInAutoScroll(params)
                        onScrollInInfiniteLoader(params)
                      }}
                      width={width}
                      height={height}
                      rowCount={rows.length}
                      rowHeight={this.cache.rowHeight}
                      rowRenderer={this.renderRow}
                      // A high overscanRowCount like 15 feels a smoother on high end devices
                      // but creates quite an overhead rendering on low end devices.
                      // Until hardware has improved or we could speed up the rendering (and calculating
                      // the height of the message) we keep a low overscanRowCount.
                      overscanRowCount={3}
                      ref={this.onRefList}
                    />
                  )}
                </AutoScroll>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
        {renderScrollLockOverlay && (
          <div className={classes.resizePlaceholder}>
            <div className={classes.resizePlaceholderContent}>
              <FormattedMessage
                id="recalculateScrollPosition"
                defaultMessage="Recalculating the scroll position…"
                description="Message showing when the user resizes the browser window."
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default injectSheet({
  grid: {
    position: 'relative',
    // Without this property, Chrome repaints the entire Grid any time a new row or column is added.
    // Firefox only repaints the new row or column (regardless of this property).
    // Safari and IE don't support the property at all.
    willChange: 'transform',
    overflowY: 'auto',
    outline: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resizePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'white',
  },
  resizePlaceholderContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    padding: [spacer.xxl * 4, spacer.xl * 2, 0],
  },
})(InfiniteList)
