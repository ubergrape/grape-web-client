import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import moment from 'moment'
import {FormattedMessage} from 'react-intl'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import Menu from '../../message-parts/Menu'
import {LinkAttachments} from '../../message-parts'
import Tooltip from '../../tooltip/HoverTooltip'
import {defaultAvatar} from '../../../constants/images'

import {OwnBubble, MateBubble, SelectedBubble} from './Bubble'
import DuplicatesBadge from './DuplicatesBadge'
import Attachment from './Attachment'
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
        defaultMessage="This message didn't send. Check your internet connection and"
      />
      {' '}
      <a href="" onClick={onResend}>
        <FormattedMessage
          id="clickToTryAgain"
          defaultMessage="click to try again"
        />
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
          defaultMessage="Pending"
        />
      )
    case 'unsent':
      return (
        <FormattedMessage
          id="unsent"
          description="message delivery status in tooltip"
          defaultMessage="Unsent"
        />
      )
    case 'sent':
      return (
        <FormattedMessage
          id="sent"
          description="message delivery status in tooltip"
          defaultMessage="Sent"
        />
      )
    case 'read':
      return (
        <FormattedMessage
          id="read"
          description="message delivery status in tooltip"
          defaultMessage="Read"
        />
      )
    default:
      return null
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
      ].join(' ')}
    >
      <Tooltip
        placement="left"
        message={getDeliveryStateTooltipMessage(state)}
      >
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

const menuHandlerMap = {
  copyLink: 'onCopyLink',
  remove: 'onRemove',
  edit: 'onEdit',
  quote: 'onQuote'
}

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
@injectSheet(styles)
export default class RegularMessage extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    userTime: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    linkAttachments: PropTypes.array.isRequired,
    customEmojis: PropTypes.object.isRequired,
    children: PropTypes.string.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isPm: PropTypes.bool.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onEdit: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onRemove: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onCopyLink: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onQuote: PropTypes.func.isRequired,
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
    avatar: defaultAvatar,
    hasBubbleArrow: true,
    isOwn: false,
    isSelected: false,
    isPm: false,
    duplicates: 0,
    attachments: [],
    linkAttachments: [],
    customEmojis: {},
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop,
    onGoToChannel: noop,
    onCopyLink: noop,
    onQuote: noop,
    time: new Date(),
    userTime: new Date().toISOString(),
    user: {}
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
    const cb = menuHandlerMap[name]
    this.props[cb]()
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

  getContentNode = () => this.content

  renderMenu = () => {
    const {isOwn, attachments, state} = this.props
    const {isMenuOpened} = this.state

    if (state === 'pending' || state === 'unsent' || !isMenuOpened) return null

    const items = ['copyLink']
    const hasAttachments = attachments.length !== 0

    if (isOwn) {
      // Attachments can't be edited.
      if (!hasAttachments) items.unshift('edit')
      items.push('remove')
    } else if (!hasAttachments) {
      items.push('quote')
    }

    return (
      <Menu
        onSelect={this.onSelectMenuItem}
        getContentNode={this.getContentNode}
        items={items}
      />
    )
  }

  renderAttachment = (attachment, key) => <Attachment {...attachment} key={key} />

  render() {
    const {
      sheet, author, user, time, userTime, avatar, children, hasBubbleArrow,
      state, isOwn, isSelected, onResend, attachments, customEmojis, duplicates,
      isPm, linkAttachments
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
            <div className={classes.avatarColumn} />
            <Header
              time={time}
              userTime={userTime}
              author={author.name}
              theme={sheet}
              onClickAuthor={canPm ? this.onGoToChannel : undefined}
            />
          </div>
        }
        <div
          className={classes.row}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <div className={classes.avatarColumn}>
            {avatar &&
              <Avatar
                src={avatar}
                className={classes[canPm ? 'clickable' : '']}
                onClick={this.onGoToChannel}
              />
            }
          </div>
          <div>
            <Bubble hasArrow={hasBubbleArrow}>
              <div
                ref={this.onRefContent}
                className={[
                  classes.content,
                  state === 'pending' || state === 'unsent' ? classes.disabled : ''
                ].join(' ')}
              >
                <Grapedown
                  text={children}
                  user={user}
                  customEmojis={customEmojis}
                />
                {attachments.map(this.renderAttachment)}
              </div>
              {this.renderMenu()}
            </Bubble>
            {duplicates > 0 && <DuplicatesBadge value={duplicates} />}
            {linkAttachments.length > 0 && <LinkAttachments attachments={linkAttachments} />}
          </div>
        </div>
        <DeliveryState state={state} time={time} theme={{classes}} />
        {state === 'unsent' &&
          <div className={classes.row}>
            <div className={classes.avatarColumn} />
            <UnsentWarning theme={{classes}} onResend={onResend} />
          </div>
        }
      </div>
    )
  }
}
