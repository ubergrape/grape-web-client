import React, {PureComponent, PropTypes} from 'react'
import {List, AutoSizer, CellMeasurer} from 'react-virtualized'
import findIndex from 'lodash/array/findIndex'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'
import RowsCache, {cache} from './RowsCache'

import {lastRowBottomSpace} from './rowTheme'
import {styles} from './infiniteListTheme'

@injectSheet(styles)
export default class InfiniteList extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onToggleExpander: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    isEditing: PropTypes.bool.isRequired
  }

  static defaultProps = {
    scrollTo: null,
    onRowsRendered: noop
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

  cache = new RowsCache(this.props.rows)

  renderRowForCellMeasurer = ({key, index, parent, style}) => (
    <CellMeasurer
      key={key}
      parent={parent}
      columnIndex={0}
      rowIndex={index}
      cache={this.cache}
    >
      {this.props.renderRow({index, key, style})}
    </CellMeasurer>
  )

  render() {
    const {
      sheet, scrollTo, onRowsRendered, onLoadMore, onTouchTopEdge,
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
                      onScrollInAutoScroll(params)
                      onScrollInInfiniteLoader(params)
                    }}
                    width={width}
                    height={height}
                    rowCount={rows.length}
                    deferredMeasurementCache={this.cache}
                    rowRenderer={this.renderRowForCellMeasurer}
                    rowHeight={this.cache.rowHeight}
                    overscanRowCount={minimumBatchSize}
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
