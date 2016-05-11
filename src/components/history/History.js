import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import moment from 'moment-timezone'

import InfiniteList from './InfiniteList'
import Message from './Message'
import DateSeparator from '../message-parts/DateSeparator'
import styles from './historyStyles'

// Group messages under same avatar/name if they are send within this time distance.
const timeThreshold = 5 * 60 * 1000

@useSheet(styles)
export default class History extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    userId: PropTypes.string,
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
    this.renderRow = ::this.renderRow
  }

  isGrouped(index) {
    const prevMessage = this.props.messages[index - 1]
    const message = this.props.messages[index]

    if (!prevMessage || !message) return false

    if (prevMessage.time.getTime() + timeThreshold > message.time.getTime()) {
      return true
    }

    return false
  }

  renderRow(messages, index) {
    const {sheet, userId} = this.props
    const {classes} = sheet
    const message = messages[index]

    const props = {
      key: `row-${message.id}`
    }

    const prevMessage = messages[index - 1]
    let separator
    if (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day')) {
      separator = (
        <DateSeparator
          theme={{date: classes.separatorDate}}
          date={message.time}
          key={`date-separator-${index}`} />
      )
    }

    if (this.isGrouped(index)) {
      props.author = null
      props.avatar = null
      props.bubbleArrow = false
    }

    if (message.authorId === userId) {
      // FIXME use differently colored bubbles by using a themed bubble component
    }

    return (
      <div>
        {separator}
        <Message {...message} {...props}>{message.content}</Message>
      </div>
    )
  }

  render() {
    const {classes} = this.props.sheet

    return (
      <div className={classes.history}>
        <InfiniteList
          messages={this.props.messages}
          onLoadMore={this.props.onLoadMore}
          renderRow={this.renderRow} />
      </div>
    )
  }
}
