import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import colors from 'grape-theme/dist/base-colors'
import { noop } from 'lodash'

import { userStatusMap } from '../../../constants/app'
import Username from '../avatar-name/Username'
import Roomname from '../avatar-name/Roomname'

const maxUnread = 99

function Unread(props) {
  const { type, unread, mentions } = props.channel
  if (!unread) return null

  const unreadCount = unread > maxUnread ? `${maxUnread}+` : unread
  const mention = type === 'room' && mentions ? '@' : ''
  const { classes } = props.theme

  let className = `${classes.sign} `
  className +=
    mention || type === 'pm' ? classes.importantSign : classes.defaultSign
  return <span className={className}>{mention + unreadCount}</span>
}

function Room(props) {
  const { channel, classes } = props
  const theme = {
    classes: {
      name: classes.channelName,
      avatarName: classes.avatarName,
    },
  }

  return (
    <div className={classes.channelInner}>
      <Roomname
        {...channel}
        statusBorderColor={colors.grayBlueLighter}
        showPrivateStatus
        theme={theme}
      />
      <Unread {...props} />
    </div>
  )
}

function Pm(props) {
  // Prop `mate` might be not present if rendered over navigation search.
  // TODO this can be done in a more consistent way.
  const {
    classes,
    channel: { partner, avatar, displayName, status },
  } = props

  const theme = {
    classes: {
      name: classes.channelName,
      avatarName: classes.avatarName,
    },
  }

  return (
    <div className={classes.channelInner}>
      <Username
        statusBorderColor={colors.grayBlueLighter}
        avatar={partner ? partner.avatar : avatar}
        status={partner ? userStatusMap[partner.status] : userStatusMap[status]}
        name={partner ? partner.displayName : displayName}
        theme={theme}
      />
      <Unread {...props} />
    </div>
  )
}

function ChannelPicker(props) {
  switch (props.channel.type) {
    case 'room':
      return <Room {...props} />
    case 'pm':
    case 'user':
      return <Pm {...props} />
    default:
      return null
  }
}

export default class Channel extends PureComponent {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    channel: PropTypes.object.isRequired,
    focused: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onClick: noop,
    focused: false,
    header: '',
  }

  render() {
    const { theme, filter, channel, focused, onClick, header } = this.props

    const { classes } = theme

    let channelClass = classes.channel
    if (!filter && channel.current) channelClass += ` ${classes.channelCurrent}`
    if (focused) channelClass += ` ${classes.channelFocused}`
    return (
      <div>
        {header && <h2 className={classes.unjoinedTitle}>{header}</h2>}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div className={channelClass} onClick={onClick}>
          <ChannelPicker {...this.props} />
        </div>
      </div>
    )
  }
}
