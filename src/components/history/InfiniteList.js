import React, {Component, PropTypes} from 'react'
import {VirtualScroll, AutoSizer} from 'react-virtualized'
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
    onRowsRendered: PropTypes.func
  }

  static defaultProps = {
    onRowsRendered: noop
  }

  constructor(props) {
    super(props)
    // FIXME clear cache
    this.rowsCache = {}
    this.state = {messages: props.messages}
  }

  componentWillReceiveProps({messages}) {
    if (messages !== this.state.messages) {
      this.setState({messages})
    }
  }

  // FIXME use action and store instead
  onLoadMore = (options) => {
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
    const {sheet, scrollTo, onRowsRendered} = this.props
    const {classes} = sheet
    const {messages} = this.state
    const rows = this.renderAndCacheRows(messages)
    const scrollToIndex = scrollTo ? messages.indexOf(scrollTo) : undefined

    return (
      <AutoRowHeight rows={rows}>
        {({
          onResize,
          rowHeight,
          renderRow,
          isRowLoaded,
          registerScroller: registerScrollerInAutoRowHeight
        }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={this.onLoadMore}
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
