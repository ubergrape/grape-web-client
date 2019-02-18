import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'

import User from './User'

export default class ChannelMembers extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    channel: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    currUser: PropTypes.object.isRequired,
    permissions: PropTypes.object,
    onLoad: PropTypes.func,
    onOpen: PropTypes.func,
    onKick: PropTypes.func,
  }

  static defaultProps = {
    onLoad: noop,
    onOpen: noop,
    onKick: noop,
    permissions: {},
  }

  componentDidMount() {
    this.props.onLoad()
  }

  componentDidUpdate(nextProps) {
    if (nextProps.channel.id !== this.props.channel.id) {
      this.props.onLoad()
    }
  }

  render() {
    const {
      users,
      channel,
      colors,
      currUser,
      onOpen,
      onKick,
      permissions,
    } = this.props

    return (
      <div>
        {users.map(user => (
          <User
            key={user.id}
            colors={colors}
            user={user}
            channel={channel}
            currUser={currUser}
            onOpen={onOpen}
            onKick={onKick}
            permissions={permissions}
          />
        ))}
      </div>
    )
  }
}
