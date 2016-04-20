import React, {Component, PropTypes} from 'react'
import isEmpty from 'lodash/lang/isEmpty'

import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import EditableString from '../editable-string/EditableString'


@useSheet(style)
export default class RoomInfo extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    roomSettings: PropTypes.object.isRequired,
    showChannelMembersInvite: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    renameRoom: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired
  }

  onInvite() {
    this.props.showChannelMembersInvite(this.props.channel)
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
    this.props.hideSidebar()
  }

  renameRoom(name) {
    const {renameRoom, channel} = this.props
    renameRoom(channel.id, name)
  }

  changeDescription(description) {
    // console.log(description)
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
    const {channel, roomSettings} = this.props
    if (isEmpty(channel)) return null

    const {classes} = this.props.sheet
    return (
      <SidebarPanel
        title="Group Info"
        onClose={::this.onClose}>
        <div className={classes.channelInfo}>

          <div className={classes.roomName}>
            <EditableString
              placeholder="Enter group name here…"
              maxLength="25"
              onSave={::this.renameRoom}
              value={channel.name}
              error={roomSettings.nameError}
              />
          </div>

          <div className={classes.roomDescription}>
            <EditableString
              placeholder="Add a group description here…"
              maxLength="100"
              type={'textarea'}
              onSave={::this.changeDescription}
              value="asdasdas jasnd jasndj asndj najsnd jasndj ansdj"
              error={roomSettings.descriptionError}
              />
          </div>

          <header className={classes.header}>
            {channel.description && <div className={classes.description}>
              <h2>Description</h2>
              <p className={classes.descriptionText}>{channel.description}</p>
            </div>}
            <div className={classes.actions}>
              <button onClick={::this.onInvite} className={classes.buttonInvite}>Invite more people to this group</button>
              <button onClick={::this.onLeave} className={classes.buttonLeave}>Leave {channel.name}</button>
            </div>
          </header>
          {channel.users.map(::this.renderUser)}
        </div>
      </SidebarPanel>
    )
  }
}
