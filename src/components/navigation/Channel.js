import React, {Component, PropTypes} from 'react'
import colors from 'grape-theme/dist/base-colors'
import noop from 'lodash/utility/noop'

import Username from '../avatar-name/Username'
import Roomname from '../avatar-name/Roomname'
import {userStatusMap} from '../../constants/app'

const maxUnread = 99

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

ChannelPicker.propTypes = {
  channel: PropTypes.object.isRequired
}

function Unread(props) {
  const {type, unread, mentioned} = props.channel
  // TODO: return `null` once upgraded to React 0.15.
  if (!unread) return <noscript />

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

Unread.propTypes = {
  channel: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

function Room(props) {
  return (
    <div>
      <Roomname {...props.channel} />
      <Unread {...props} />
    </div>
  )
}

Room.propTypes = {
  channel: PropTypes.object.isRequired
}

function Pm(props) {
  const {mate} = props.channel
  return (
    <div>
      <Username
        statusBorderColor={colors.grayBlueLighter}
        avatar={mate.avatar}
        status={userStatusMap[mate.status]}
        name={mate.displayName} />
      <Unread {...props} />
    </div>
  )
}

Pm.propTypes = {
  channel: PropTypes.object.isRequired
}

export default class Channel extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    filter: PropTypes.string.isRequired,
    channel: PropTypes.object.isRequired,
    focused: PropTypes.bool.isRequired,
    goToChannel: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    goToChannel: noop,
    onClick: noop,
    focused: false
  }

  render() {
    const {
      theme,
      filter,
      channel,
      focused,
      onClick
    } = this.props

    const {classes} = theme

    let channelClass = classes.channel
    if (!filter && channel.current) channelClass += ` ${classes.channelCurrent}`
    if (focused) channelClass += ` ${classes.channelFocused}`
    return (
      <div
        className={channelClass}
        onClick={onClick}>
        <ChannelPicker {...this.props} />
      </div>
    )
  }
}
