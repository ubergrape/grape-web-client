import {InfiniteLoader, VirtualScroll, AutoSizer} from 'react-virtualized'
import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'

import styles from './infiniteListStyles'

@useSheet(styles)
export default class InfiniteList extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func,
    messages: PropTypes.object,
    rowsCount: PropTypes.number
  }

  static defaultProps = {
    rowsCount: 0,
    messages: {},
    onLoadMore: noop
  }

  constructor(props) {
    super(props)
    this.isRowLoaded = ::this.isRowLoaded
    this.renderRow = ::this.renderRow
    this.calcRowHeight = ::this.calcRowHeight
  }

  isRowLoaded(index) {
    return Boolean(this.props.messages[index])
  }

  calcRowHeight(index) {
    const message = this.props.messages[index]
    return message ? message.height : 50
  }

  renderRow(index) {
    const message = this.props.messages[index]
    return message ? message.element : null
  }

  render() {
    const {sheet, rowsCount} = this.props
    const {classes} = sheet

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.props.onLoadMore}
        rowsCount={Infinity}>
        {({onRowsRendered, registerChild}) => {
          return (
            <AutoSizer disableHeight>
              {({width, height}) => (
                <VirtualScroll
                  className={classes.grid}
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  width={width}
                  height={height}
                  rowsCount={rowsCount}
                  rowHeight={this.calcRowHeight}
                  rowRenderer={this.renderRow} />
              )}
            </AutoSizer>
          )
        }}
      </InfiniteLoader>
    )
  }
}
