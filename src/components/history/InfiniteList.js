import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import List from 'react-virtualized/dist/es/List'
import AutoSizer from 'react-virtualized/dist/es/AutoSizer'
import CellMeasurer from 'react-virtualized/dist/es/CellMeasurer'
import findIndex from 'lodash/array/findIndex'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'
import RowsCache, {cache} from './RowsCache'

import {lastRowBottomSpace} from './rowTheme'

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

  constructor(props) {
    super(props)
    this.cache = new RowsCache(props.rows)
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
      cache.clear()
      this.list.recomputeRowHeights()
    }
    this.prevWidth = width
  }

  isRowLoaded = index => Boolean(this.props.rows[index])

  scrollToRow = (index) => { this.list.scrollToRow(index) }

  renderRowForCellMeasurer = ({rowIndex: index}) => this.props.renderRow({index})

  render() {
    const {
      onRowsRendered, onLoadMore, onTouchTopEdge, onScroll,
      scrollTo, renderRow, rows, minimumBatchSize,
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
              <CellMeasurer
                cellSizeCache={this.cache}
                cellRenderer={this.renderRowForCellMeasurer}
                columnCount={1}
                rowCount={rows.length}
                width={width}
              >
                {({getRowHeight}) => (
                  <AutoScroll
                    rows={rows}
                    height={height}
                    scrollToIndex={scrollToRow}
                    minEndThreshold={lastRowBottomSpace}
                    scrollToRow={this.scrollToRow}
                  >
                    {({
                      onScroll: onScrollInAutoScroll,
                      scrollToAlignment,
                      scrollToIndex,
                      onRowsRendered: onRowsRenderedInAutoScroll
                    }) => (
                      <List
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
                        rowHeight={getRowHeight}
                        rowRenderer={renderRow}
                        overscanRowCount={5}
                        ref={this.onRefList}
                      />
                    )}
                  </AutoScroll>
                )}
              </CellMeasurer>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
}
