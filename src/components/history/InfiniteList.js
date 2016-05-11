import {VirtualScroll, AutoSizer} from 'react-virtualized'
import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import AutoRowHeight from './AutoRowHeight'
import AutoScroll from './AutoScroll'
import InfiniteLoader from './InfiniteLoader'

import styles from './infiniteListStyles'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    // FIXME clear cache
    this.rowsCache = {}
    this.onLoadMore = ::this.onLoadMore
    this.state = {messages: props.messages}
  }

  onLoadMore(options) {
    const promise = this.props.onLoadMore(options)
    if (promise) {
      promise.then(messages => this.setState({messages}))
    }
    return promise
  }

  renderAndCacheRows(messages) {
    return messages.map((message, index) => {
      let row = this.rowsCache[message.id]
      if (!row) {
        row = this.props.renderRow(messages, index)
        this.rowsCache[message.id] = row
      }
      return row
    })
  }

  render() {
    const {sheet} = this.props
    const {classes} = sheet
    const {messages} = this.state
    const rows = this.renderAndCacheRows(messages)

    return (
      <AutoRowHeight rows={rows}>
        {({
          onResize,
          rowHeight,
          renderRow,
          isRowLoaded,
          registerChild: registerChildAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.onLoadMore}
            threshold={5}
            minimumBatchSize={40}>
            {({
              onRowsRendered: onRowsRenderedInfiniteLoader,
              registerChild: registerChildInfiniteLoader,
              onScroll: onScrollInfiniteLoader
            }) => (
              <AutoSizer onResize={onResize}>
                {({width, height}) => (
                  <AutoScroll
                    rows={rows}
                    rowHeight={rowHeight}
                    // Some very high value to ensure initial scroll position at the bottom.
                    scrollTop={10000000}>
                    {({
                      onScroll: onScrollAutoScroll,
                      scrollTop,
                      onRowsRendered: onRowsRenderedAutoScroll
                    }) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollTop={scrollTop}
                        ref={ref => {
                          registerChildInfiniteLoader(ref)
                          registerChildAutoRowHeight(ref)
                        }}
                        onRowsRendered={params => {
                          onRowsRenderedAutoScroll(params)
                          onRowsRenderedInfiniteLoader(params)
                        }}
                        onScroll={params => {
                          onScrollAutoScroll(params)
                          onScrollInfiniteLoader(params)
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
