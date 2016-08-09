import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer, CellMeasurer} from 'react-virtualized'
import shallowEqual from 'react-pure-render/shallowEqual'
import shallowCompare from 'react-addons-shallow-compare'
import noop from 'lodash/utility/noop'
import findIndex from 'lodash/array/findIndex'
import {useSheet} from 'grape-web/lib/jss'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'

import {styles} from './infiniteListTheme'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func,
    cacheSize: PropTypes.number
  }

  static defaultProps = {
    onRowsRendered: noop
  }

  constructor(props) {
    super(props)
    // FIXME move caching to a separate class and use some FIFO cache with limited
    // size, use cacheSize prop.
    this.cache = {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messages !== this.props.messages) {
      this.cellMeasurer.resetMeasurements()
      this.virtualScroll.recomputeRowHeights()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onRefCellMeasurer = (ref) => {
    this.cellMeasurer = ref
  }

  onRefVirtualScroll = (ref) => {
    this.virtualScroll = ref
  }

  getRowHeight = (params) => {
    const {index} = params
    const {id} = this.props.messages[index]
    let cache = this.cache[id]

    if (cache && cache.height !== undefined) {
      return cache.height
    }

    if (!cache) cache = this.cache[id] = {}

    this.cellMeasurer.resetMeasurementForRow(index)
    cache.height = this.cellMeasurer.getRowHeight(params)

    return cache.height
  }

  isRowLoaded = (index) => {
    return Boolean(this.props.messages[index])
  }

  renderRow = ({index}) => {
    const {messages, renderRow} = this.props
    const message = messages[index]
    const cache = this.cache[message.id]

    if (cache && shallowEqual(message, cache.message)) {
      return cache.row
    }

    const row = renderRow(index)
    this.cache[message.id] = {...cache, row, message}

    return row
  }

  renderRowForCellMeasurer = ({rowIndex: index}) => {
    return this.renderRow({index})
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
          <AutoSizer>
            {({width, height}) => (
              <CellMeasurer
                cellRenderer={this.renderRowForCellMeasurer}
                columnCount={1}
                rowCount={messages.length}
                width={width}
                ref={this.onRefCellMeasurer}>
                {() => (
                  this.cellMeasurer ?
                  <AutoScroll
                    rows={messages}
                    rowHeight={this.getRowHeight}
                    scrollToIndex={scrollToMessageIndex}>
                    {({
                      onScroll: onScrollInAutoScroll,
                      scrollTop,
                      scrollToIndex,
                      onRowsRendered: onRowsRenderedAutoScroll
                    }) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollTop={scrollTop}
                        scrollToIndex={scrollToIndex}
                        onRowsRendered={params => {
                          onRowsRenderedAutoScroll(params)
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
                        rowHeight={this.getRowHeight}
                        rowRenderer={this.renderRow}
                        overscanRowCount={20}
                        ref={this.onRefVirtualScroll} />
                    )}
                  </AutoScroll>
                  :
                  null
                )}
              </CellMeasurer>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }
}
