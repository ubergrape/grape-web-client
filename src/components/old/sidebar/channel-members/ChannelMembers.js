import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { noop } from 'lodash'

import { limit, bottomOffset } from '../../../../constants/sidebar'
import User from './User'

export default class ChannelMembers extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    isEveryMemberLoaded: PropTypes.bool,
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
    isEveryMemberLoaded: false,
    sidebarRef: undefined,
    onLoad: noop,
    onOpen: noop,
    onKick: noop,
    permissions: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      shift: limit,
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
        shift: limit,
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
    const { users, isEveryMemberLoaded } = this.props
    const { shift } = this.state

    if (
      shift > users.length ||
      isEveryMemberLoaded // Do not load members, if everybody already loaded
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
