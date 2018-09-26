import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'

import User from './User'

export default class ChannelMembers extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    channel: PropTypes.object.isRequired,
    permissions: PropTypes.shape({
      canRemoveMembers: PropTypes.bool,
    }),
    onLoad: PropTypes.func,
    onOpen: PropTypes.func,
    onKick: PropTypes.func,
  }

  static defaultProps = {
    onLoad: noop,
    onOpen: noop,
    onKick: noop,
    permissions: {
      canRemoveMembers: true,
    },
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
    const { users, channel, onOpen, onKick, permissions } = this.props

    return (
      <div>
        {users.map(user => (
          <User
            key={user.id}
            user={user}
            channel={channel}
            onOpen={onOpen}
            onKick={onKick}
            permissions={permissions}
          />
        ))}
      </div>
    )
  }
}
