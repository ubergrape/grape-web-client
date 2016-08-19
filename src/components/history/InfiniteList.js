import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer, CellMeasurer} from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import noop from 'lodash/utility/noop'
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
    renderRow: PropTypes.func.isRequired,
    getRowProps: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func
  }

  static defaultProps = {
    onRowsRendered: noop,
    getRowProps: noop
  }

  constructor(props) {
    super(props)
    this.cache = new RowsCache(props.messages, props.getRowProps)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages !== this.props.messages) {
      this.cache.setRows(nextProps.messages)
      this.virtualScroll.recomputeRowHeights()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onRefVirtualScroll = (ref) => {
    this.virtualScroll = ref
  }

  onResize = () => {
    // When container gets resized, we can forget all cached heights.
    cache.clear()
    this.virtualScroll.recomputeRowHeights()
  }

  isRowLoaded = (index) => {
    return Boolean(this.props.messages[index])
  }

  renderRow = ({index}) => {
    return this.props.renderRow(index)
  }

  renderRowForCellMeasurer = ({rowIndex}) => {
    return this.props.renderRow(rowIndex)
  }

  render() {
    const {
      sheet, scrollTo, onRowsRendered, onLoadMore, onTouchTopEdge,
      messages, minimumBatchSize
    } = this.props

    const {classes} = sheet
    const scrollToMessageIndex = scrollTo ? findIndex(messages, {id: scrollTo}) : undefined

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
          <AutoSizer onResize={this.onResize}>
            {({width, height}) => (
              <CellMeasurer
                cellSizeCache={this.cache}
                cellRenderer={this.renderRowForCellMeasurer}
                columnCount={1}
                rowCount={messages.length}
                width={width}>
                {({getRowHeight}) => (
                  <AutoScroll
                    rows={messages}
                    height={height}
                    scrollToIndex={scrollToMessageIndex}>
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
                        rowCount={messages.length}
                        rowHeight={getRowHeight}
                        rowRenderer={this.renderRow}
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
