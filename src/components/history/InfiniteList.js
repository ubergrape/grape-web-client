import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer, CellMeasurer} from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import noop from 'lodash/utility/noop'
import findIndex from 'lodash/array/findIndex'
import {useSheet} from 'grape-web/lib/jss'
import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'
import Cache from './Cache'

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
    this.cache = new Cache(props.messages)
  }

  componentWillReceiveProps(nextProps) {
    this.cache.setRows(nextProps.messages)
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

  isRowLoaded = (index) => {
    return Boolean(this.props.messages[index])
  }

  renderRow = ({index}) => {
    if (this.cache.hasElement(index)) return this.cache.getElement(index)
    const element = this.props.renderRow(index)
    this.cache.setElement(index, element)
    return element
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
                cellSizeCache={this.cache}
                cellRenderer={this.renderRowForCellMeasurer}
                columnCount={1}
                rowCount={messages.length}
                width={width}
                ref={this.onRefCellMeasurer}>
                {({getRowHeight}) => (
                  <AutoScroll
                    rows={messages}
                    rowHeight={getRowHeight}
                    scrollToIndex={scrollToMessageIndex}>
                    {({
                      onScroll: onScrollInAutoScroll,
                      scrollTop,
                      scrollToIndex,
                      onRowsRendered: onRowsRenderedInAutoScroll
                    }) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollTop={scrollTop}
                        scrollToIndex={scrollToIndex}
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
