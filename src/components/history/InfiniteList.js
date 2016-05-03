import {InfiniteLoader, VirtualScroll, AutoSizer} from 'react-virtualized'
import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'

import AutoRowHeight from './AutoRowHeight'
import AutoScroll from './AutoScroll'
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
    this.state = {rows: this.renderAndCacheRows(props.messages)}
  }

  onLoadMore(options) {
    const promise = this.props.onLoadMore(options)
    if (!promise) return null
    promise.then((messages) => {
      this.setState({rows: this.renderAndCacheRows(messages)})
    })
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
    const {rows} = this.state
    const {classes} = sheet

    return (
      <AutoRowHeight rows={rows}>
        {({
          onResize,
          rowHeight,
          renderRow,
          isRowLoaded,
          registerChild: registerChildInAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.onLoadMore}
            rowsCount={Infinity}
            threshold={20}
            minimumBatchSize={20}>
            {({onRowsRendered, registerChild}) => (
              <AutoSizer onResize={onResize}>
                {({width, height}) => (
                  <AutoScroll rows={rows}>
                    {({onScroll, scrollToIndex}) => (
                      <VirtualScroll
                        className={classes.grid}
                        scrollToIndex={scrollToIndex}
                        ref={ref => {
                          registerChild(ref)
                          registerChildInAutoRowHeight(ref)
                        }}
                        onRowsRendered={onRowsRendered}
                        onScroll={onScroll}
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
