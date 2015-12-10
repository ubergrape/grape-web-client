import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'
import tz from 'moment-timezone'

import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'

const dateFormat = 'MMMM Do, YYYY'

function getStats(channel) {
  const amount = channel.users.length
  const plural = amount > 1 ? 's' : ''
  const date = tz(channel.created).format(dateFormat)
  let text = `The room ${channel.name} has ${amount} member${plural} and has`
  text += ' been created'
  if (channel.creator) text += ` by ${channel.creator.displayName}`
  text += ` on ${date}.`
  return text
}

@useSheet(style)
export default class ChannelInfo extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    inviteChannelMember: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    hideChannelInfo: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  onInvite() {
    this.props.inviteChannelMember(this.props.channel)
  }

  onKickMember(user) {
    this.props.kickMemberFromChannel({
      channelId: this.props.channel.id,
      userId: user.id
    })
  }

  onSelectMember(user) {
    this.props.goToChannel(user.slug)
  }

  onLeave() {
    this.props.leaveChannel(this.props.channel.id)
  }

  onClose() {
    this.props.hideChannelInfo()
  }

  renderUser(user) {
    const {classes} = this.props.sheet
    return (
      <div key={user.id} className={classes.row}>
        <img
          className={classes.avatar}
          src={user.avatar}
          onClick={this.onSelectMember.bind(this, user)} />
        <span
          className={classes.name}
          onClick={this.onSelectMember.bind(this, user)}>
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
    const isCreator = channel.creator && currUser.id === channel.creator.id
    const hasCreated = channel.creator && user.id === channel.creator.id
    const isKickMaster = isAdmin && !isSelf

    if (!isKickMaster || isSelf || isCreator || hasCreated) return null

    return (
      <button
        className={classes.buttonKick}
        onClick={this.onKickMember.bind(this, user)}>
      </button>
    )
  }

  render() {
    if (!this.props.show) return null
    const {classes} = this.props.sheet
    const {channel} = this.props
    return (
      <SidebarPanel
        title="Room Info"
        onClose={::this.onClose}>
        <div className={classes.channelInfo}>
          <header className={classes.header}>
            <div className={classes.stats}>
              {getStats(channel)}
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
          {channel.users.map(::this.renderUser)}
        </div>
      </SidebarPanel>
    )
  }
}
