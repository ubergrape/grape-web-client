import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import copy from 'copy-to-clipboard'
import notification from 'notification'
import moment from 'moment'

import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import {OwnBubble, MateBubble, SelectedBubble} from './Bubble'
import DuplicatesBadge from './DuplicatesBadge'
import Menu from '../../message-parts/Menu'
import {getWidth as getMenuWidth} from '../../message-parts/menuTheme'
import ImageAttachment from '../../message-parts/attachments/ImageAttachment'
import LinkAttachment from '../../message-parts/attachments/LinkAttachment'
import Tooltip from '../../tooltip/HoverTooltip'
import {styles} from './regularMessageTheme'

function UnsentWarning(props) {
  const {classes} = props.theme

  function onResend(e) {
    e.preventDefault()
    props.onResend()
  }

  return (
    <div className={classes.unsentWarning}>
      {' '}
      <FormattedMessage
        id="messageNotSendCheckConnection"
        defaultMessage="This message didn't send. Check your internet connection and" />
      {' '}
      <a href="" onClick={onResend}>
        <FormattedMessage
          id="clickToTryAgain"
          defaultMessage="click to try again" />
      </a>.
    </div>
  )
}

UnsentWarning.propTypes = {
  onResend: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

function getDeliveryStateTooltipMessage(state) {
  switch (state) {
    case 'pending':
      return (
        <FormattedMessage
          id="pending"
          description="message delivery status in tooltip"
          defaultMessage="Pending" />
      )
    case 'unsent':
      return (
        <FormattedMessage
          id="unsent"
          description="message delivery status in tooltip"
          defaultMessage="Unsent" />
      )
    case 'sent':
      return (
        <FormattedMessage
          id="sent"
          description="message delivery status in tooltip"
          defaultMessage="Sent" />
      )
    case 'read':
      return (
        <FormattedMessage
          id="read"
          description="message delivery status in tooltip"
          defaultMessage="Read" />
      )
    default:
  }
}

function DeliveryState({time, state, theme}) {
  // Mark only today's messages.
  const isFresh = moment(time).isSame(new Date(), 'day')

  if (!state || state === 'unsent' || !isFresh) return null

  const {classes} = theme

  return (
    <span
      className={[
        classes.stateIndicator,
        classes[`stateIndicator${capitalize(state)}`]
      ].join(' ')}>
        <Tooltip
          placement="left"
          message={getDeliveryStateTooltipMessage(state)}>
            <span className={classes.stateIndicatorTooltipTrigger} />
        </Tooltip>
    </span>
  )
}

DeliveryState.propTypes = {
  state: PropTypes.oneOf(['pending', 'sent', 'unsent', 'read']),
  time: PropTypes.instanceOf(Date).isRequired,
  theme: PropTypes.object.isRequired
}

const messages = defineMessages({
  confirm: {
    id: 'deleteMessagesQuestion',
    defaultMessage: 'Delete the selected Message?'
  },
  copy: {
    id: 'linkInClipboard',
    defaultMessage: 'Message link added to clipboard'
  }
})

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
@injectSheet(styles)
@injectIntl
export default class RegularMessage extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    userTime: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    customEmojis: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isPm: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    onGoToChannel: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    duplicates: PropTypes.number.isRequired,
    // Author and avatar are optional because we show them only for the first
    // message in the row.
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string
    }),
    avatar: PropTypes.string,
    state: DeliveryState.propTypes.state
  }

  static defaultProps = {
    hasBubbleArrow: true,
    isOwn: false,
    isSelected: false,
    attachments: [],
    customEmojis: {},
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onGoToChannel: noop
  }

  constructor(props) {
    super(props)
    this.state = {isMenuOpened: false}
  }

  onMouseEnter = () => {
    this.setState({isMenuOpened: true})
  }

  onMouseLeave = () => {
    this.setState({isMenuOpened: false})
  }

  onSelectMenuItem = ({name}) => {
    const {formatMessage} = this.props.intl
    switch (name) {
      case 'copyLink':
        copy(this.props.link)
        notification.info(formatMessage(messages.copy))
        break
      case 'remove': {
        if (confirm(formatMessage(messages.confirm))) { // eslint-disable-line no-alert
          this.props.onRemove()
        }
        break
      }
      case 'edit':
        this.props.onEdit()
        break
      default:
    }
  }

  onRefContent = (ref) => {
    this.content = ref
  }

  onRefBody = (ref) => {
    this.body = ref
  }

  onGoToChannel = () => {
    const {isPm, isOwn, author, onGoToChannel} = this.props
    if (!isPm && !isOwn && author.slug) onGoToChannel(author.slug)
  }

  renderMenu = () => {
    const {isOwn, attachments, sheet, state} = this.props

    if (state === 'pending' || state === 'unsent') return null
    if (!this.state.isMenuOpened) return null

    let items

    if (isOwn) {
      // Attachments can't be edited.
      items = `${attachments.length ? '' : 'edit,'}copyLink,remove`.split(',')
    } else {
      // Foreign messages can't be editted or removed.
      items = ['copyLink']
    }
    const canFit = this.content.offsetWidth > getMenuWidth(items.length)
    const className = sheet.classes[`menu${canFit ? 'Top' : 'Right'}`]

    return (
      <Menu
        onSelect={this.onSelectMenuItem}
        className={className}
        items={items} />
    )
  }

  // https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#attachments
  renderAttachment = (attachment, key) => {
    if (attachment.thumbnailUrl) {
      return <ImageAttachment {...attachment} key={key} />
    }
    return <LinkAttachment {...attachment} key={key} />
  }

  render() {
    const {
      sheet, author, user, time, userTime, avatar, children, hasBubbleArrow,
      state, isOwn, isSelected, onResend, attachments, customEmojis, duplicates,
      isPm
    } = this.props
    const {classes} = sheet

    let Bubble
    if (isSelected) {
      Bubble = SelectedBubble
    } else {
      Bubble = isOwn ? OwnBubble : MateBubble
    }

    const canPm = isPm ? false : Boolean(!isOwn && author && author.slug)

    return (
      <div className={classes.message}>
        {author &&
          <div className={classes.row}>
            <div className={classes.avatarColumn}></div>
            <Header
              time={time}
              userTime={userTime}
              author={author.name}
              theme={sheet}
              onClickAuthor={canPm ? this.onGoToChannel : undefined} />
          </div>
        }
        <div
          className={classes.row}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <div className={classes.avatarColumn}>
            {avatar &&
              <Avatar
                src={avatar}
                className={classes[canPm ? 'clickable' : '']}
                onClick={this.onGoToChannel} />
            }
          </div>
          <Bubble hasArrow={hasBubbleArrow}>
            <div
              ref={this.onRefContent}
              className={[
                classes.content,
                state === 'pending' || state === 'unsent' ? classes.disabled : ''
              ].join(' ')}>
              <Grapedown
                text={children}
                user={user}
                customEmojis={customEmojis} />
              {attachments.map(this.renderAttachment)}
            </div>
            {this.renderMenu()}
          </Bubble>
          {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
        </div>
        <DeliveryState state={state} time={time} theme={{classes}} />
        {state === 'unsent' &&
          <div className={classes.row}>
            <div className={classes.avatarColumn}></div>
            <UnsentWarning theme={{classes}} onResend={onResend} />
          </div>
        }
      </div>
    )
  }
}
