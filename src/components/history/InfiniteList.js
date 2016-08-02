import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'
import shallowEqual from 'react-pure-render/shallowEqual'
import noop from 'lodash/utility/noop'
import findIndex from 'lodash/array/findIndex'
import {useSheet} from 'grape-web/lib/jss'

import AutoRowHeight from '../react-virtualized/AutoRowHeight'
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
    // FIXME clear cache
    this.rowsCache = {}
  }

  renderAndCacheRows(messages) {
    return messages.map((message, index) => {
      let cache = this.rowsCache[message.id]
      if (!cache || !shallowEqual(message, cache.message)) {
        const row = this.props.renderRow(messages, index)
        cache = {row, message}
        this.rowsCache[message.id] = cache
      }
      return cache.row
    })
  }

  render() {
    const {
      sheet, scrollTo, onRowsRendered, onLoadMore, onTouchTopEdge,
      messages, cacheSize, minimumBatchSize
    } = this.props
    const {classes} = sheet
    const rows = this.renderAndCacheRows(messages)
    const focusedMessageIndex = scrollTo ? findIndex(messages, {id: scrollTo}) : undefined
    return (
      <AutoRowHeight rows={rows} cacheSize={cacheSize}>
        {({
          onResize,
          getRowHeight,
          renderRow,
          isRowLoaded,
          registerScroller: registerScrollerInAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={onLoadMore}
            onTouchTopEdge={onTouchTopEdge}
            threshold={5}
            minimumBatchSize={minimumBatchSize}>
            {({
              onRowsRendered: onRowsRenderedInInfiniteLoader,
              onScroll: onScrollInInfiniteLoader
            }) => (
              <AutoSizer onResize={onResize}>
                {({width, height}) => (
                  <AutoScroll
                    rows={rows}
                    rowHeight={getRowHeight}
                    scrollToIndex={focusedMessageIndex}>
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
                        ref={registerScrollerInAutoRowHeight}
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
                        rowsCount={rows.length}
                        rowHeight={getRowHeight}
                        rowRenderer={renderRow} />
                    )}
                  </AutoScroll>
                )}
              </AutoSizer>
            )}
          </InfiniteLoader>
        )}
      </AutoRowHeight>
    )
  }
}
