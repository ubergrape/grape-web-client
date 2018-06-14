import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import CellMeasurer from 'react-virtualized/dist/commonjs/CellMeasurer'
import List from 'react-virtualized/dist/commonjs/List'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import debounce from 'lodash/function/debounce'
import findIndex from 'lodash/array/findIndex'
import { spacer } from 'grape-theme/dist/sizes'
import { FormattedMessage } from 'react-intl'

import AutoScroll from '../react-virtualized/AutoScroll'
import InfiniteLoader from '../react-virtualized/InfiniteLoader'

import { lastRowBottomSpace } from './rowTheme'
import RowsCache from './RowsCache'

@injectSheet({
  grid: {
    position: 'relative',
    // Without this property, Chrome repaints the entire Grid any time a new row or column is added.
    // Firefox only repaints the new row or column (regardless of this property).
    // Safari and IE don't support the property at all.
    willChange: 'transform',
    overflowY: 'auto',
    outline: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  resizePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'white',
  },
  resizePlaceholderContent: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    padding: [spacer.xxl * 4, spacer.xl * 2, 0],
  },
})
export default class InfiniteList extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onScroll: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onToggleExpander: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    rows: PropTypes.array.isRequired,
    minimumBatchSize: PropTypes.number.isRequired,
    scrollTo: PropTypes.string,
    onRowsRendered: PropTypes.func,
  }

  static defaultProps = {
    scrollTo: null,
    onRowsRendered: noop,
  }

  state = { scrollLocked: false }

  componentDidMount() {
    this.cache.setRows(this.props.rows)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rows !== this.props.rows) {
      this.cache.setRows(nextProps.rows)
      this.list.recomputeRowHeights()
    }
  }

  onRefList = ref => {
    this.list = ref
  }

  onRowsRendered = ({ startIndex, stopIndex }) => {
    if (!this.state.scrollLocked) {
      const index = Math.floor((startIndex + stopIndex) / 2)
      this.idOfMessageToBeFocusedAfterResize = this.props.rows[index].id
      this.didRenderLastRow = this.props.rows.length === stopIndex + 1
    }
  }

  onResizeViewport = ({ width }) => {
    // When container gets resized, we can forget all cached heights.
    // Compare additionally with a locally cached width, because
    // this function is called in some cases even when width has not changed.
    if (this.prevWidth !== undefined && this.prevWidth !== width) {
      this.setState({ scrollLocked: true })
      this.cache.clearAll()
      this.list.recomputeRowHeights()
      this.debounedScrollToRowBeforeResize()
    }
    this.prevWidth = width
  }

  debounedScrollToRowBeforeResize = debounce(() => {
    // When the last row was rendered the user was either at the bottom or very close
    // to the bottom of the chat. Jumping to the last row was the best experience in
    // this case.
    if (this.didRenderLastRow) {
      this.scrollToRow(this.props.rows.length - 1)
    } else {
      const newIndex = findIndex(
        this.props.rows,
        item => item.id === this.idOfMessageToBeFocusedAfterResize,
      )
      this.list.scrollToRow(newIndex)
    }
    this.setState({ scrollLocked: false })
  }, 700)

  cache = new RowsCache({ fixedWidth: true })

  scrollLocked = false

  isRowLoaded = index => Boolean(this.props.rows[index])

  scrollToRow = index => {
    this.list.scrollToRow(index)
  }

  scrollToPosition = value => {
    this.list.scrollToPosition(value)
  }

  renderRow = ({ index, key, parent, style }) => (
    <CellMeasurer
      cache={this.cache}
      parent={parent}
      columnIndex={0}
      key={key}
      rowIndex={index}
    >
      {this.props.renderRow({ index, key, style })}
    </CellMeasurer>
  )

  render() {
    const {
      onRowsRendered,
      onLoadMore,
      onTouchTopEdge,
      onScroll,
      scrollTo,
      rows,
      minimumBatchSize,
      classes,
    } = this.props

    const scrollToRow = scrollTo ? findIndex(rows, { id: scrollTo }) : undefined

    return (
      <div className={classes.wrapper}>
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={onLoadMore}
          onTouchTopEdge={onTouchTopEdge}
          threshold={5}
          minimumBatchSize={minimumBatchSize}
        >
          {({
            onRowsRendered: onRowsRenderedInInfiniteLoader,
            onScroll: onScrollInInfiniteLoader,
          }) => (
            <AutoSizer onResize={this.onResizeViewport}>
              {({ width, height }) => (
                <AutoScroll
                  rows={rows}
                  height={height}
                  scrollToIndex={scrollToRow}
                  minEndThreshold={lastRowBottomSpace}
                  scrollToRow={this.scrollToRow}
                  scrollToPosition={this.scrollToPosition}
                >
                  {({
                    onScroll: onScrollInAutoScroll,
                    scrollToAlignment,
                    scrollToIndex,
                    onRowsRendered: onRowsRenderedInAutoScroll,
                  }) => (
                    <List
                      deferredMeasurementCache={this.cache}
                      className={classes.grid}
                      scrollToIndex={scrollToIndex}
                      scrollToAlignment={scrollToAlignment}
                      onRowsRendered={params => {
                        this.onRowsRendered(params)
                        onRowsRenderedInAutoScroll(params)
                        onRowsRenderedInInfiniteLoader(params)
                        onRowsRendered(params)
                      }}
                      onScroll={params => {
                        onScroll(params)
                        onScrollInAutoScroll(params)
                        onScrollInInfiniteLoader(params)
                      }}
                      width={width}
                      height={height}
                      rowCount={rows.length}
                      rowHeight={this.cache.rowHeight}
                      rowRenderer={this.renderRow}
                      overscanRowCount={5}
                      ref={this.onRefList}
                    />
                  )}
                </AutoScroll>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
        {this.state.scrollLocked && (
          <div className={classes.resizePlaceholder}>
            <div className={classes.resizePlaceholderContent}>
              <FormattedMessage
                id="recalculateScrollPosition"
                defaultMessage="Recalculating the scroll position…"
                description="Message showing when the user resizes the browser window."
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}
