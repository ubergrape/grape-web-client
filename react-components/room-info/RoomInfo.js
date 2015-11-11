import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'
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
    onSelectMember: noop,
    onInvite: noop,
    onLeave: noop,
    onClose: noop
  }

  onInvite() {
    this.props.onInvite()
  }

  onKickMember(user) {
    this.props.onKickMember(user)
  }

  onSelect(user) {
    this.props.onSelectMember(user)
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
          <header className={classes.header}>
            <div className={classes.stats}>
              The room {channel.name} has {users.length} member{plural}{creatorText} on {tz(channel.created).format(dateFormat)}.
            </div>
            {this.props.channel.description && <div className={classes.description}>
              <h2>Purpose</h2>
              <p className={classes.descriptionText}>{this.props.channel.description}</p>
            </div>}
            <div className={classes.actions}>
              <button onClick={::this.onInvite} className={classes.buttonInvite}>Invite more people to this room</button>
              <button onClick={::this.onLeave} className={classes.buttonLeave}>Leave {channel.name}</button>
            </div>
          </header>
          {users.map(::this.renderUser)}
        </div>
      </SidebarPanel>
    )
  }

  renderUser(user) {
    const {classes} = this.props.sheet
    return (
      <div key={user.id} className={classes.row}>
          <img
            className={classes.avatar}
            src={user.avatar}
            onClick={this.onSelect.bind(this, user)} />
          <span
            className={classes.name}
            onClick={this.onSelect.bind(this, user)}>
            {user.displayName}
          </span>
          {this.renderDeleteButton(user)}
      </div>
    )
  }

  renderDeleteButton(user) {
    const {classes} = this.props.sheet
    const {channel} = this.props
    const currUser = this.props.user
    const isSelf = currUser.id === user.id
    const isAdmin = currUser.role >= constants.roles.ROLE_ADMIN
    const isCreator = currUser.id === channel.creator.id
    const hasCreated = user.id === channel.creator.id
    const isKickMaster = isAdmin && !isSelf

    if (!isKickMaster || isSelf || isCreator || hasCreated) return null

    return (
      <button
        className={classes.buttonKick}
        onClick={this.onKickMember.bind(this, user)}>
      </button>
    )
  }
}
