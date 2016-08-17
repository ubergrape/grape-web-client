import React, {Component, PropTypes} from 'react'
import shallowCompare from 'react-addons-shallow-compare'
import noop from 'lodash/utility/noop'
import {useSheet} from 'grape-web/lib/jss'
import moment from 'moment'

import RegularMessage from './messages/RegularMessage'
import ActivityMessage from './messages/ActivityMessage'
import DateSeparator from '../message-parts/DateSeparator'
import {styles} from './rowTheme'

const messageComponents = {
  regular: RegularMessage,
  activity: ActivityMessage
}

const idPropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.string
])

const messagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(messageComponents)).isRequired,
  author: PropTypes.shape({
    id: idPropType.isRequired
  }).isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  text: PropTypes.string
})

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
export default class Row extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    user: PropTypes.shape({
      id: idPropType.isRequired
    }).isRequired,
    message: messagePropType.isRequired,
    prevMessage: messagePropType,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onGoToChannel: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    // Will highlight a message by id.
    selectedMessageId: PropTypes.string
  }

  static defaultProps = {
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onGoToChannel: noop,
    isLast: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  onEdit = () => {
    const {onEdit, message} = this.props
    onEdit(message)
  }

  onRemove = () => {
    const {onRemove, message} = this.props
    onRemove(message)
  }

  onResend = () => {
    const {onResend, message} = this.props
    onResend(message)
  }

  render() {
    const {
      sheet: {classes},
      user, onGoToChannel, selectedMessageId, message, prevMessage, customEmojis,
      isLast
    } = this.props

    let separator = null
    if (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day')) {
      separator = (
        <DateSeparator
          theme={{date: classes.separator}}
          date={message.time}
          key={`date-separator-${message.id}`} />
      )
    }

    const Message = messageComponents[message.type]
    const props = {
      ...message,
      key: `row-${message.id}`,
      user,
      onGoToChannel,
      customEmojis,
      isOwn: message.author.id === user.id,
      isSelected: selectedMessageId === message.id,
      onEdit: this.onEdit,
      onRemove: this.onRemove,
      onResend: this.onResend
    }

    const group = canGroup(message, prevMessage)

    if (!separator && group) {
      props.author = null
      props.avatar = null
      props.hasBubbleArrow = false
    }

    return (
      <div className={`${classes[group ? 'groupedRow' : 'row']} ${isLast ? classes.lastRow : ''}`}>
        {separator}
        <Message {...props}>
          {message.text}
        </Message>
      </div>
    )
  }
}
