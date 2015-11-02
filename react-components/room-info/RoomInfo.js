import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {constants} from 'conf'
import {useSheet} from '../jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

const dateFormat = 'MMMM Do, YYYY'

@useSheet(style)
export default class RoomInfo extends Component {
  static defaultProps = {
    show: false,
    channel: undefined,
    user: undefined,
    onKickMember: noop,
    onInvite: noop,
    onLeave: noop,
    onClose: noop
  }

  onInvite() {
    this.props.onInvite()
  }

  onKickMember({id}) {
    this.props.onKickMember({id})
  }

  onLeave() {
    this.props.onLeave()
  }

  onClose() {
    this.props.onClose()
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    if (!this.props.show) return null
    let {classes} = this.props.sheet
    let {channel} = this.props
    let {users} = channel
    let plural = users.length > 1 ? 's' : ''
    let creatorText
    if (channel.creator) {
      creatorText = ` and has been created by ${channel.creator.displayName}`
    }
    return (
      <SidebarPanel
        title="Room Info"
        onClose={::this.onClose}>
        <div className={classes.roomInfo}>
          <div>
            The room {channel.name} has {users.length} member{plural}{creatorText} on {tz(channel.created).format(dateFormat)}.
          </div>
          <div onClick={::this.onInvite}>
            <button>Invite more people to this room</button>
          </div>
          <div onClick={::this.onLeave}>
            <button>Leave {channel.name}</button>
          </div>
          <div className={classes.userList}>
            {users.map(::this.renderUser)}
          </div>
        </div>
      </SidebarPanel>
    )
  }

  renderUser(user) {
    const {classes} = this.props.sheet
    const href = `/chat/${user.slug}`
    return (
      <div key={user.id}>
        <a href={href}>
          <aside className={classes.avatarWrap}>
            <img
              className={classes.avatar}
              width="20"
              height="20"
              src={user.avatar} />
          </aside>
          <span>
            {user.displayName}
          </span>
        </a>
      </div>
    )
  }

  renderDeleteButton(user) {
    const {classes} = this.props.sheet
    const {channel} = this.props
    const currUser = this.props.user
    const canUserKick = currUser.id === channel.creator.id || currUser.role >= constants.roles.ROLE_ADMIN
    // User has be have the rights to kick.
    // User should not be able to kick itself.
    // User should not be able to kick the creator of the room.
    if (!canUserKick || currUser.id === user.id && user.id === channel.creator.id) return null
    return (
      <button
        className={classes.deleteButton}
        onClick={this.onKickMember.bind(this, user)}>
      </button>
    )
  }
}
