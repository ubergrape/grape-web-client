import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
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

@injectSheet(styles)
export default class Row extends PureComponent {
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
    onToggleExpander: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    isGroupable: PropTypes.bool.isRequired,
    isPm: PropTypes.bool.isRequired,
    duplicates: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
    key: PropTypes.string,
    isExpanded: PropTypes.bool,
    // Will highlight a message by id.
    selectedMessageId: PropTypes.string
  }

  static defaultProps = {
    isLast: false,
    isGroupable: false,
    duplicates: []
  }

  onEdit = () => {
    const {onEdit, message} = this.props
    onEdit(message)
  }

  onRemove = () => {
    const {onRemove, duplicates, message} = this.props
    onRemove([...duplicates, message.id].map(id => ({id})))
  }

  onResend = () => {
    const {onResend, message} = this.props
    onResend(message)
  }

  render() {
    const {
      sheet: {classes},
      user, onGoToChannel, selectedMessageId, message, prevMessage, customEmojis,
      isLast, isGroupable, duplicates, onToggleExpander, isExpanded, isPm,
      style, key, onCopyLinkClick
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
      onToggleExpander,
      customEmojis,
      duplicates: duplicates.length,
      isOwn: message.author.id === user.id,
      isSelected: selectedMessageId === message.id,
      isPm,
      hasBubbleArrow: true,
      onEdit: this.onEdit,
      onRemove: this.onRemove,
      onResend: this.onResend,
      onCopyLinkClick
    }

    if (message.type === 'activity') {
      props.isExpanded = isExpanded
    }

    if (!separator && isGroupable) {
      props.author = null
      props.avatar = null
      props.hasBubbleArrow = false
    }

    return (
      <div
        className={`${classes[isGroupable ? 'groupedRow' : 'row']} ${isLast ? classes.lastRow : ''}`}
        style={style}
        key={key}>
        {separator}
        <Message {...props}>
          {message.text}
        </Message>
      </div>
    )
  }
}
