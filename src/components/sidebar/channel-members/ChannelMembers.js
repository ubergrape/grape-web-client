import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'

import User from './User'

export default class ChannelMembers extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    totalMembers: PropTypes.number,
    channel: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    currUser: PropTypes.object.isRequired,
    permissions: PropTypes.object,
    sidebarRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onLoad: PropTypes.func,
    onOpen: PropTypes.func,
    onKick: PropTypes.func,
  }

  static defaultProps = {
    totalMembers: 0,
    sidebarRef: undefined,
    onLoad: noop,
    onOpen: noop,
    onKick: noop,
    permissions: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      limit: 50,
      shift: 50,
      // A height of each member item is 42. 10 of them it's 420.
      bottomOffset: 420,
    }
  }

  componentDidMount() {
    this.props.onLoad(true)
    this.props.sidebarRef.addEventListener('scroll', this.onScroll, true)
  }

  componentWillReceiveProps(nextProps) {
    const { shift } = this.state
    if (shift > nextProps.users.length) {
      this.setState({
        shift: 50,
      })
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.channel.id !== this.props.channel.id) {
      this.props.onLoad(true)
    }
  }

  componentWillUnmount() {
    this.props.sidebarRef.removeEventListener('scroll', this.onScroll, true)
  }

  onScroll = e => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target
    const { users, totalMembers } = this.props
    const { shift, limit, bottomOffset } = this.state
    if (
      shift > users.length ||
      totalMembers === users.length // Do not load members, if everybody already loaded
    )
      return

    if (offsetHeight + scrollTop + bottomOffset >= scrollHeight) {
      this.setState({
        shift: shift + limit,
      })
      this.props.onLoad(false, users[users.length - 1].joinedAt)
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
