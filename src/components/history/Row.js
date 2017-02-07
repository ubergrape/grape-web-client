import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import {
  intlShape,
  injectIntl,
  defineMessages
} from 'react-intl'

import RegularMessage from './messages/RegularMessage'
import ActivityMessage from './messages/ActivityMessage'
import DateSeparator from '../message-parts/DateSeparator'
import {styles} from './rowTheme'

const messages = defineMessages({
  confirm: {
    id: 'deleteMessagesQuestion',
    defaultMessage: 'Delete the selected Message?'
  },
  copy: {
    id: 'linkInClipboard',
    defaultMessage: 'Message link added to clipboard'
  },
  quoteFooter: {
    id: 'quoteFooter',
    defaultMessage: '- [Message]({messageUrl}) from {author}',
    description: 'Quoted message footer text.'
  }
})

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
@injectIntl
export default class Row extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
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
    onQuote: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    isLast: PropTypes.bool.isRequired,
    isGroupable: PropTypes.bool.isRequired,
    isPm: PropTypes.bool.isRequired,
    duplicates: PropTypes.arrayOf(PropTypes.string).isRequired,
    style: PropTypes.object,
    key: PropTypes.string,
    isExpanded: PropTypes.bool.isRequired,
    // Will highlight a message by id.
    selectedMessageId: PropTypes.string
  }

  static defaultProps = {
    isLast: false,
    isGroupable: false,
    isExpanded: false,
    duplicates: [],
    prevMessage: null,
    style: null,
    key: null,
    selectedMessageId: null
  }

  onEdit = () => {
    const {onEdit, message} = this.props
    onEdit(message)
  }

  onCopyLink = () => {
    const {
      intl: {formatMessage},
      onCopyLink,
      message: {link}
    } = this.props
    copy(link)
    onCopyLink(formatMessage(messages.copy))
  }

  onRemove = () => {
    const {
      intl: {formatMessage},
      onRemove,
      message,
      duplicates
    } = this.props

    // eslint-disable-next-line no-alert
    if (confirm(formatMessage(messages.confirm))) {
      onRemove([...duplicates, message.id].map(id => ({id})))
    }
  }

  onQuote = () => {
    const {
      intl: {formatMessage},
      message: {text, author, link},
      onQuote
    } = this.props

    const quote = text
      .split('\n')
      .map(part => `> ${part}`)
      .join('\n')

    const footer = formatMessage(messages.quoteFooter, {
      messageUrl: link,
      author: author.slug ? `[${author.name}](/chat/${author.slug})` : author.name
    })

    onQuote({quote: `\n\n${quote}\n\n${footer}`})
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
      style, key
    } = this.props

    let separator = null
    if (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day')) {
      separator = (
        <DateSeparator
          theme={{date: classes.separator}}
          date={message.time}
          key={`date-separator-${message.id}`}
        />
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
      onCopyLink: this.onCopyLink,
      onQuote: this.onQuote
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
        key={key}
      >
        {separator}
        <Message {...props}>
          {message.text}
        </Message>
      </div>
    )
  }
}
