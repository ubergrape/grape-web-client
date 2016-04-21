import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {InfiniteLoader, VirtualScroll, AutoSizer} from 'react-virtualized'
import {useSheet} from 'grape-web/lib/jss'
import moment from 'moment-timezone'

import Message from './Message'
import DateSeparator from '../message-parts/DateSeparator'
import styles from './styles'

// Group messages under same avatar/name if they are send within this time distance.
const timeThreshold = 5 * 60 * 1000

@useSheet(styles)
export default class History extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      authorId: PropTypes.string.isRequired
    }))
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
    const {messages, sheet} = this.props
    const {classes} = sheet
    const message = {...messages[index]}
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

    if (prevMessage && prevMessage.time.getTime() + timeThreshold > message.time.getTime()) {
      delete message.author
      delete message.avatar
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
