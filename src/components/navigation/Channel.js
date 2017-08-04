import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import colors from 'grape-theme/dist/base-colors'
import noop from 'lodash/utility/noop'

import Username from '../avatar-name/Username'
import Roomname from '../avatar-name/Roomname'
import {userStatusMap} from '../../constants/app'

const maxUnread = 99

function Unread(props) {
  const {type, unread, mentioned} = props.channel
  if (!unread) return null

  const unreadCount = unread > maxUnread ? `${maxUnread}+` : unread
  const mention = type === 'room' && mentioned ? '@' : ''
  const {classes} = props.theme

  let className = `${classes.sign} `
  className += mention || type === 'pm' ? classes.importantSign : classes.defaultSign
  return (
    <span className={className}>
      {mention + unreadCount}
    </span>
  )
}

function Room(props) {
  const {channel, classes} = props
  const theme = {
    classes: {
      name: classes.channelName
    }
  }

  return (
    <div>
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
  const {classes, channel: {mate}} = props
  const theme = {
    classes: {
      name: classes.channelName
    }
  }

  return (
    <div>
      <Username
        statusBorderColor={colors.grayBlueLighter}
        avatar={mate.avatar}
        status={userStatusMap[mate.status]}
        name={mate.displayName}
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
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    onClick: noop,
    focused: false,
    header: ''
  }

  render() {
    const {
      theme,
      filter,
      channel,
      focused,
      onClick,
      header
    } = this.props

    const {classes} = theme

    let channelClass = classes.channel
    if (!filter && channel.current) channelClass += ` ${classes.channelCurrent}`
    if (focused) channelClass += ` ${classes.channelFocused}`
    return (
      <div>
        {header && <h2 className={classes.unjoinedTitle}>{header}</h2>}
        <div
          className={channelClass}
          onClick={onClick}
        >
          <ChannelPicker {...this.props} />
        </div>
      </div>
    )
  }
}
