import React, {Component, PropTypes} from 'react'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import moment from 'moment'

import InfiniteList from './InfiniteList'
import RegularMessage from './messages/RegularMessage'
import ActivityMessage from './messages/ActivityMessage'

import ReadMessageDispatcher from './ReadMessageDispatcher'
import Jumper from './Jumper'
import DateSeparator from '../message-parts/DateSeparator'
import {styles} from './historyTheme'

const messageTypes = {
  regular: RegularMessage,
  activity: ActivityMessage
}

// Group messages under same avatar/name if they are send within this time distance.
const timeThreshold = 5 * 60 * 1000

function canGroup(message, prevMessage) {
  if (!prevMessage || !message) return false

  // We don't group activities?
  if (message.type === 'activity') return false

  // Is not the same author.
  if (prevMessage.author.id !== message.author.id) return false

  // Group if within defined time threshold.
  return prevMessage.time.getTime() + timeThreshold > message.time.getTime()
}

@useSheet(styles)
export default class History extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onLoad: PropTypes.func.isRequired,
    onTouchTopEdge: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onRead: PropTypes.func.isRequired,
    onClickUser: PropTypes.func.isRequired,
    onUserScrollAfterScrollTo: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    channelId: PropTypes.number,
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(Object.keys(messageTypes)).isRequired,
        author: PropTypes.shape({
          id: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
          ]).isRequired
        }).isRequired,
        time: PropTypes.instanceOf(Date).isRequired
      })
    ),
    user: PropTypes.object,
    // Will scroll to a message by id.
    scrollTo: PropTypes.string,
    // Will highlight a message by id.
    selectedMessageId: PropTypes.string,
    minimumBatchSize: PropTypes.number
  }

  static defaultProps = {
    messages: [],
    onLoad: noop,
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onRead: noop,
    onClickUser: noop,
    onTouchTopEdge: noop,
    customEmojis: {},
    onUserScrollAfterScrollTo: noop
  }

  componentWillReceiveProps(nextProps) {
    const {channelId} = nextProps
    // 1. It is initial load, we had no channel id.
    // 2. New channel has been selected.
    if (channelId !== this.props.channelId) {
      this.props.onLoad({channelId})
    }
  }

  onLoadMore = (options) => {
    this.props.onLoad({
      ...options,
      channelId: this.props.channelId
    })
  }

  onJumpToEnd = () => {
    this.props.onLoad({
      channelId: this.props.channelId,
      jumpToEnd: true
    })
  }

  onRowsRendered = () => {
    // We need to unset the scrollTo once user has scrolled around, because he
    // might want to use jumper to jump again to the same scrollTo value.
    if (this.props.scrollTo) {
      this.props.onUserScrollAfterScrollTo()
    }
  }

  renderRow = (index) => {
    const {
      sheet, user, messages,
      customEmojis, onEdit, onRemove, onResend,
      onClickUser, selectedMessageId
    } = this.props

    const {classes} = sheet
    const message = messages[index]
    const Message = messageTypes[message.type]
    const props = {
      key: `row-${message.id}`,
      isOwn: message.author.id === user.id,
      user,
      onClickUser,
      customEmojis,
      isSelected: selectedMessageId === message.id
    }

    const prevMessage = messages[index - 1]

    let separator = null
    if (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day')) {
      separator = (
        <DateSeparator
          theme={{date: classes.separatorDate}}
          date={message.time}
          key={`date-separator-${index}`} />
      )
    }

    const isGrouped = canGroup(message, prevMessage)

    if (!separator && isGrouped) {
      props.author = null
      props.avatar = null
      props.hasBubbleArrow = false
    }

    return (
      <div className={isGrouped ? classes.groupedMessage : classes.message}>
        {separator}
        <Message
          {...message}
          {...props}
          onEdit={onEdit.bind(null, message)}
          onRemove={onRemove.bind(null, message)}
          onResend={onResend.bind(null, message)}>
          {message.text}
        </Message>
      </div>
    )
  }

  render() {
    const {
      sheet, messages, user, scrollTo, minimumBatchSize,
      onTouchTopEdge, channelId, onRead
    } = this.props
    const {classes} = sheet

    if (!user || !messages.length) return null

    return (
      <ReadMessageDispatcher
        messages={messages}
        channelId={channelId}
        onRead={onRead}>
        {({onRowsRendered: onRowsRenderedInReadMessageDispatcher}) => (
          <Jumper
            onJump={this.onJumpToEnd}
            className={classes.history}>
            {({onRowsRendered: onRowsRenderedInJumper}) => (
              <InfiniteList
                onRowsRendered={(params) => {
                  onRowsRenderedInJumper(params)
                  onRowsRenderedInReadMessageDispatcher(params)
                  this.onRowsRendered(params)
                }}
                scrollTo={scrollTo}
                messages={messages}
                minimumBatchSize={minimumBatchSize}
                onLoadMore={this.onLoadMore}
                onTouchTopEdge={onTouchTopEdge}
                renderRow={this.renderRow} />
            )}
          </Jumper>
        )}
      </ReadMessageDispatcher>
    )
  }
}
