import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {InfiniteLoader, VirtualScroll, AutoSizer} from 'react-virtualized'
import {useSheet} from 'grape-web/lib/jss'
import moment from 'moment-timezone'

import Message from './Message'
import DateSeparator from '../messages/DateSeparator'
import styles from './styles'

@useSheet(styles)
export default class History extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    messages: PropTypes.array
  }

  static defaultProps = {
    messages: [],
    onLoadMore: noop
  }

  constructor(props) {
    super(props)
    this.isRowLoaded = ::this.isRowLoaded
    this.renderRow = ::this.renderRow
    this.renderList = ::this.renderList
  }

  isRowLoaded() {
    return true
  }

  renderRow(index) {
    const {messages} = this.props
    const {classes} = this.props.sheet
    const message = messages[index]
    const prevMessage = messages[index - 1]
    const row = []
    if (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day')) {
      row.push(
        <DateSeparator
          theme={{date: classes.separatorDate}}
          date={message.time}
          key={'date-separator-' + index} />
      )
    }
    row.push(<Message {...message} key={'row-' + index}>{message.content}</Message>)
    return row
  }

  renderList({onRowsRendered, registerChild}) {
    const {messages} = this.props
    const {classes} = this.props.sheet

    return (
      <AutoSizer disableHeight>
        {({width, height}) => (
          <VirtualScroll
            className={classes.grid}
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            width={width}
            height={height}
            rowsCount={messages.length}
            rowHeight={60}
            rowRenderer={this.renderRow} />
        )}
      </AutoSizer>
    )
  }

  render() {
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.props.onLoadMore}
        rowsCount={Infinity}>
        {this.renderList}
      </InfiniteLoader>
    )
  }
}
