import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import moment from 'moment'
import copy from 'copy-to-clipboard'
import { intlShape, injectIntl, defineMessages } from 'react-intl'

import conf from '../../../conf'
import RegularMessage from './messages/regular/RegularMessage'
import ActivityMessage from './messages/activity/ActivityMessage'
import DateSeparator from '../message-parts/DateSeparator'
import { styles } from './rowTheme'

const messages = defineMessages({
  confirm: {
    id: 'deleteMessagesQuestion',
    defaultMessage: 'Delete the selected message?',
  },
  copy: {
    id: 'linkInClipboard',
    defaultMessage: 'Message link added to clipboard',
  },
})

const messageComponents = {
  regular: RegularMessage,
  activity: ActivityMessage,
}

const idPropType = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

const messagePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.keys(messageComponents)).isRequired,
  author: PropTypes.shape({
    id: idPropType.isRequired,
  }).isRequired,
  time: PropTypes.string.isRequired,
  text: PropTypes.string,
})

class Row extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    user: PropTypes.shape({
      role: PropTypes.number.isRequired,
      id: idPropType.isRequired,
    }).isRequired,
    message: messagePropType.isRequired,
    prevMessage: messagePropType,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onOpenPm: PropTypes.func.isRequired,
    onToggleExpander: PropTypes.func.isRequired,
    onQuote: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired,
    customEmojis: PropTypes.object.isRequired,
    isLast: PropTypes.bool,
    isGroupable: PropTypes.bool,
    isPm: PropTypes.bool.isRequired,
    duplicates: PropTypes.arrayOf(PropTypes.string),
    style: PropTypes.object,
    colors: PropTypes.object,
    key: PropTypes.string,
    isExpanded: PropTypes.bool,
    // Will highlight a message by id.
    selectedMessageId: PropTypes.string,
    onRemoveLinkAttachment: PropTypes.func.isRequired,
    onPin: PropTypes.func.isRequired,
    permissions: PropTypes.object.isRequired,
    onUnpin: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isLast: false,
    isGroupable: false,
    isExpanded: false,
    duplicates: [],
    prevMessage: null,
    style: null,
    key: null,
    colors: {},
    selectedMessageId: null,
  }

  onEdit = () => {
    const { onEdit, message } = this.props
    onEdit(message)
  }

  onCopyLink = () => {
    const {
      intl: { formatMessage },
      onCopyLink,
      message: { link },
    } = this.props
    copy(link)
    onCopyLink(formatMessage(messages.copy))
  }

  onRemove = () => {
    const {
      intl: { formatMessage },
      onRemove,
      message,
      duplicates,
    } = this.props

    // eslint-disable-next-line no-alert
    if (window.confirm(formatMessage(messages.confirm))) {
      onRemove([...duplicates, message].map(({ state, id }) => ({ state, id })))
    }
  }

  onQuote = () => {
    const { message, onQuote } = this.props

    onQuote({ message })
  }

  onResend = () => {
    const { onResend, message } = this.props
    onResend(message)
  }

  render() {
    const {
      sheet: { classes },
      user,
      onOpenPm,
      selectedMessageId,
      message,
      prevMessage,
      customEmojis,
      isLast,
      isGroupable,
      duplicates,
      onToggleExpander,
      onPin,
      onUnpin,
      isExpanded,
      isPm,
      style,
      key,
      colors,
      permissions,
      onRemoveLinkAttachment,
    } = this.props

    let separator = null
    if (
      !prevMessage ||
      (prevMessage && !moment(message.time).isSame(prevMessage.time, 'day'))
    ) {
      separator = (
        <DateSeparator
          theme={{ date: classes.separator }}
          date={message.time}
          key={`date-separator-${message.id}`}
        />
      )
    }

    const Message = messageComponents[message.type]
    const props = {
      ...message,
      key: `row-${message.id}`,
      colors,
      user,
      onPin,
      onUnpin,
      onOpenPm,
      onToggleExpander,
      customEmojis,
      permissions,
      duplicates: duplicates.length,
      isOwn: message.author.id === user.id,
      isSelected: selectedMessageId === message.id,
      isPm,
      hasBubbleArrow: true,
      onEdit: this.onEdit,
      onRemove: this.onRemove,
      onResend: this.onResend,
      onCopyLink: this.onCopyLink,
      onQuote: this.onQuote,
      onRemoveLinkAttachment,
    }

    if (message.type === 'activity') {
      props.isExpanded = isExpanded
    }

    if (!separator && isGroupable) {
      props.author = null
      props.avatar = null
      props.hasBubbleArrow = false
    }

    const isAdmin = user.role >= conf.constants.roles.ROLE_ADMIN

    return (
      <div
        className={`${classes[isGroupable ? 'groupedRow' : 'row']} ${
          isLast ? classes.lastRow : ''
        }`}
        style={style}
        key={key}
      >
        {separator}
        <Message {...props} isAdmin={isAdmin}>
          {message.text}
        </Message>
      </div>
    )
  }
}

export default injectSheet(styles)(injectIntl(Row))
