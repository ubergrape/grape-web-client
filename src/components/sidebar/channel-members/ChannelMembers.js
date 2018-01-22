import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import noop from 'lodash/utility/noop'

import User from './User'

export default class ChannelMembers extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    channel: PropTypes.object.isRequired,
    currUser: PropTypes.object.isRequired,
    onLoad: PropTypes.func,
    onOpen: PropTypes.func,
    onKick: PropTypes.func
  }

  static defaultProps = {
    onLoad: noop,
    onOpen: noop,
    onKick: noop,
    users: []
  }

  componentDidMount() {
    this.props.onLoad()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.channel !== this.props.channel) {
      this.props.onLoad()
    }
  }

  render() {
    const {users, channel, currUser, onOpen, onKick} = this.props

    return (
      <div>
        {users.map(user => (
          <User
            key={user.id}
            user={user}
            channel={channel}
            currUser={currUser}
            onOpen={onOpen}
            onKick={onKick}
          />
        ))}
      </div>
    )
  }
}
