import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer, CellMeasurer} from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import findIndex from 'lodash/array/findIndex'
import {useSheet} from 'grape-web/lib/jss'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'
import RowsCache, {cache} from './RowsCache'
import {styles} from './infiniteListTheme'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    onToggleExpander: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.cache = new RowsCache(props.rows)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.cache.setRows(nextProps.rows)
      this.virtualScroll.recomputeRowHeights()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onRefVirtualScroll = (ref) => {
    this.virtualScroll = ref
  }

  onResizeViewport = ({width}) => {
    // When container gets resized, we can forget all cached heights.
    // Compare additionally with a locally cached width, because
    // this function is called in some cases even when width has not changed.
    if (this.prevWidth !== undefined && this.prevWidth !== width) {
      cache.clear()
      this.virtualScroll.recomputeRowHeights()
    }
    this.prevWidth = width
  }

  isRowLoaded = index => Boolean(this.props.rows[index])

  renderRowForCellMeasurer = ({rowIndex: index}) => this.props.renderRow({index})

  render() {
    const {
      sheet, scrollTo, onRowsRendered, onLoadMore, onTouchTopEdge, renderRow,
      rows, minimumBatchSize
    } = this.props

    const {classes} = sheet
    const scrollToRow = scrollTo ? findIndex(rows, {id: scrollTo}) : undefined

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={onLoadMore}
        onTouchTopEdge={onTouchTopEdge}
        threshold={5}
        minimumBatchSize={minimumBatchSize}>
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
                width={width}>
                {({getRowHeight}) => (
                  <AutoScroll
                    rows={rows}
                    height={height}
                    scrollToIndex={scrollToRow}>
                    {({
                      onScroll: onScrollInAutoScroll,
                      scrollToAlignment,
                      scrollToIndex,
                      onRowsRendered: onRowsRenderedInAutoScroll
                    }) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollToIndex={scrollToIndex}
                        scrollToAlignment={scrollToAlignment}
                        onRowsRendered={params => {
                          onRowsRenderedInAutoScroll(params)
                          onRowsRenderedInInfiniteLoader(params)
                          onRowsRendered(params)
                        }}
                        onScroll={params => {
                          onScrollInAutoScroll(params)
                          onScrollInInfiniteLoader(params)
                        }}
                        width={width}
                        height={height}
                        rowCount={rows.length}
                        rowHeight={getRowHeight}
                        rowRenderer={renderRow}
                        overscanRowCount={20}
                        ref={this.onRefVirtualScroll} />
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
