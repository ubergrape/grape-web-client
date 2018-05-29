import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import List from 'react-virtualized/dist/commonjs/List'
import findIndex from 'lodash/array/findIndex'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'

import {lastRowBottomSpace} from './rowTheme'
import RowsCache from './RowsCache'

@injectSheet({
  grid: {
    position: 'relative',
    // Without this property, Chrome repaints the entire Grid any time a new row or column is added.
    // Firefox only repaints the new row or column (regardless of this property).
    // Safari and IE don't support the property at all.
    willChange: 'transform',
    overflowY: 'auto',
    outline: 'none',
    WebkitOverflowScrolling: 'touch'
  }
})
export default class InfiniteList extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onToggleExpander: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func
  }

  static defaultProps = {
    scrollTo: null,
    onRowsRendered: noop
  }

  componentDidMount() {
    this.cache.setRows(this.props.rows)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.cache.setRows(nextProps.rows)
      this.list.recomputeRowHeights()
    }
  }

  onRefList = (ref) => {
    this.list = ref
  }

  onResizeViewport = ({width}) => {
    // When container gets resized, we can forget all cached heights.
    // Compare additionally with a locally cached width, because
    // this function is called in some cases even when width has not changed.
    if (this.prevWidth !== undefined && this.prevWidth !== width) {
      this.cache.clearAll()
      this.list.recomputeRowHeights()
      // TODO This is a regression after upgrading react-virtualized to v9
      // Clearing the cache and recomputing the row heights results in multile
      // row renders where at some point the scroll position is 0 and the whole
      // list has only a fraction of the size. Since the amount of re-renders
      // isn't predictable we simply always scroll to the end manually for now.
      this.scrollToRow(this.props.rows.length - 1)
    }
    this.prevWidth = width
  }

  cache = new RowsCache({fixedWidth: true})

  isRowLoaded = index => Boolean(this.props.rows[index])

  scrollToRow = (index) => { this.list.scrollToRow(index) }

  scrollToPosition = (value) => { this.list.scrollToPosition(value) }

  renderRow = ({index, key, parent, style}) => (
    <CellMeasurer
      cache={this.cache}
      parent={parent}
      columnIndex={0}
      key={key}
      rowIndex={index}
    >
      {this.props.renderRow({index, key, style})}
    </CellMeasurer>
  )

  render() {
    const {
      onRowsRendered, onLoadMore, onTouchTopEdge, onScroll,
      scrollTo, rows, minimumBatchSize,
      classes
    } = this.props

    const scrollToRow = scrollTo ? findIndex(rows, {id: scrollTo}) : undefined

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={onLoadMore}
        onTouchTopEdge={onTouchTopEdge}
        threshold={5}
        minimumBatchSize={minimumBatchSize}
      >
        {({
          onRowsRendered: onRowsRenderedInInfiniteLoader,
          onScroll: onScrollInInfiniteLoader
        }) => (
          <AutoSizer onResize={this.onResizeViewport}>
            {({width, height}) => (
              <AutoScroll
                rows={rows}
                height={height}
                scrollToIndex={scrollToRow}
                minEndThreshold={lastRowBottomSpace}
                scrollToRow={this.scrollToRow}
                scrollToPosition={this.scrollToPosition}
              >
                {({
                  onScroll: onScrollInAutoScroll,
                  scrollToAlignment,
                  scrollToIndex,
                  onRowsRendered: onRowsRenderedInAutoScroll
                }) => (
                  <List
                    deferredMeasurementCache={this.cache}
                    className={classes.grid}
                    scrollToIndex={scrollToIndex}
                    scrollToAlignment={scrollToAlignment}
                    onRowsRendered={(params) => {
                      onRowsRenderedInAutoScroll(params)
                      onRowsRenderedInInfiniteLoader(params)
                      onRowsRendered(params)
                    }}
                    onScroll={(params) => {
                      onScroll(params)
                      onScrollInAutoScroll(params)
                      onScrollInInfiniteLoader(params)
                    }}
                    width={width}
                    height={height}
                    rowCount={rows.length}
                    rowHeight={this.cache.rowHeight}
                    rowRenderer={this.renderRow}
                    overscanRowCount={5}
                    ref={this.onRefList}
                  />
                )}
              </AutoScroll>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
}
