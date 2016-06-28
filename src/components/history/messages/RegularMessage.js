import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import {useSheet} from 'grape-web/lib/jss'
import noop from 'lodash/utility/noop'
import capitalize from 'lodash/string/capitalize'
import copy from 'copy-to-clipboard'
import moment from 'moment'

import Avatar from '../../avatar/Avatar'
import Grapedown from '../../grapedown/Grapedown'
import Header from '../../message-parts/Header'
import {OwnBubble, MateBubble, SelectedBubble} from './Bubble'
import Menu from '../../message-parts/Menu'
import ImageAttachment from '../../message-parts/attachments/ImageAttachment'
import LinkAttachment from '../../message-parts/attachments/LinkAttachment'
import {styles} from './regularMessageTheme'

function Unsent(props) {
  const {classes} = props.theme

  function onResend(e) {
    e.preventDefault()
    props.onResend()
  }

  return (
    <div className={classes.unsent}>
      {' This message didn\'t send. Check your internet connection and '}
      <a href="" onClick={onResend}>click to try again</a>.
    </div>
  )
}

Unsent.propTypes = {
  onResend: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
}

function DeliveryState({time, isPending, isSent, isUnsent, isRead, theme}) {
  const hasState = isPending || isSent || isUnsent || isRead

  // Mark only today's messages.
  const isFresh = moment(time).isSame(new Date(), 'day')

  if (!hasState || !isFresh) return <noscript />

  let state
  if (isPending) state = 'pending'
  if (isSent) state = 'sent'
  if (isUnsent) state = 'unsent'
  if (isRead) state = 'read'

  const {classes} = theme

  return (
    <span
      className={[
        classes.stateIndicator,
        classes[`stateIndicator${capitalize(state)}`]
      ].join(' ')}>
    </span>
  )
}

DeliveryState.propTypes = {
  isRead: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  isSent: PropTypes.bool.isRequired,
  isUnsent: PropTypes.bool.isRequired,
  time: PropTypes.instanceOf(Date).isRequired,
  theme: PropTypes.object.isRequired
}

DeliveryState.defaultProps = {
  isRead: false,
  isPending: false,
  isSent: false,
  isUnsent: false
}


// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2#message
@useSheet(styles)
export default class RegularMessage extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    time: PropTypes.instanceOf(Date).isRequired,
    userTime: PropTypes.string.isRequired,
    attachments: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    hasBubbleArrow: PropTypes.bool.isRequired,
    isPending: PropTypes.bool.isRequired,
    isUnsent: PropTypes.bool.isRequired,
    isOwn: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onResend: PropTypes.func.isRequired,
    // Author and avatar are optional because we show them only for the first
    // message in the row.
    author: PropTypes.shape({
      name: PropTypes.string.isRequired
    }),
    avatar: PropTypes.string
  }

  static defaultProps = {
    isPending: false,
    isUnsent: false,
    hasBubbleArrow: true,
    isOwn: false,
    isSelected: false,
    attachments: [],
    children: '',
    onEdit: noop,
    onRemove: noop,
    onResend: noop
  }

  constructor(props) {
    super(props)
    this.state = {isMenuOpened: false}
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onMouseEnter = () => (this.setState({isMenuOpened: true}))

  onMouseLeave = () => (this.setState({isMenuOpened: false}))

  onSelect = ({name}) => {
    switch (name) {
      case 'copyLink':
        copy(this.props.link)
        break
      case 'remove':
        if (confirm('Delete the selected Message?')) { // eslint-disable-line no-alert
          this.props.onRemove()
        }
        break
      case 'edit':
        this.props.onEdit()
        break
      default:
    }
  }

  renderMenu = () => {
    const {isOwn, attachments, sheet, isPending, isUnsent} = this.props

    if (isPending || isUnsent) return null
    if (!this.state.isMenuOpened) return null

    let items

    if (isOwn) {
      // Attachments can't be edited.
      if (attachments.length) {
        items = ['copyLink', 'remove']
      }
    } else {
      // Foreign messages can't be editted or removed.
      items = ['copyLink']
    }

    return (
      <Menu
        onSelect={this.onSelect}
        className={sheet.classes.menu}
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
      sheet, author, time, userTime, avatar, children, hasBubbleArrow,
      isPending, isUnsent, isOwn, isSelected, onResend, attachments
    } = this.props
    const {classes} = sheet
    let Bubble
    if (isSelected) {
      Bubble = SelectedBubble
    } else {
      Bubble = isOwn ? OwnBubble : MateBubble
    }
    return (
      <div className={classes.message}>
        {author &&
          <Header
            time={time}
            userTime={userTime}
            author={author.name}
            className={classes.header} />
        }
        <div
          className={`${classes.body} ${avatar ? '' : classes.avatarPlaceholder}`}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          {avatar && <Avatar src={avatar} className={classes.avatar} />}
          <Bubble className={classes.bubble} hasArrow={hasBubbleArrow}>
            <div className={`${classes.content} ${isPending || isUnsent ? classes.pending : ''}`}>
              <Grapedown text={children} />
              {attachments.map(this.renderAttachment)}
            </div>
            {this.renderMenu()}
          </Bubble>
        </div>
        <DeliveryState {...this.props} theme={{classes}} />
        {isUnsent && <Unsent theme={{classes}} onResend={onResend} />}
      </div>
    )
  }
}
