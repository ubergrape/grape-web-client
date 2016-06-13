import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'
import shallowEqual from 'react-pure-render/shallowEqual'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import AutoRowHeight from './AutoRowHeight'
import AutoScroll from './AutoScroll'
import InfiniteLoader from './InfiniteLoader'

import {styles} from './infiniteListTheme'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    scrollTo: PropTypes.object,
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
      sheet, scrollTo, onRowsRendered, onLoadMore, messages, cacheSize
    } = this.props
    const {classes} = sheet
    const rows = this.renderAndCacheRows(messages)
    const scrollToIndex = scrollTo ? messages.indexOf(scrollTo) : undefined

    return (
      <AutoRowHeight rows={rows} cacheSize={cacheSize}>
        {({
          onResize,
          rowHeight,
          renderRow,
          isRowLoaded,
          registerScroller: registerScrollerInAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={onLoadMore}
            threshold={5}
            minimumBatchSize={40}>
            {({
              onRowsRendered: onRowsRenderedInInfiniteLoader,
              onScroll: onScrollInInfiniteLoader
            }) => (
              <AutoSizer onResize={onResize}>
                {({width, height}) => (
                  <AutoScroll
                    rows={rows}
                    rowHeight={rowHeight}>
                    {({
                      onScroll: onScrollInAutoScroll,
                      scrollTop,
                      onRowsRendered: onRowsRenderedAutoScroll
                    }) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollTop={scrollToIndex ? undefined : scrollTop}
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
                        rowHeight={rowHeight}
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
