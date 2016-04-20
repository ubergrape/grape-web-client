import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import isEmpty from 'lodash/lang/isEmpty'
import {
  maxChannelNameLength,
  maxChannelDescriptionLength
} from '../../constants/app'

import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import EditableString from '../editable-string/EditableString'
import Dropdown from '../dropdown/Dropdown'

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
    setRoomDescription: PropTypes.func.isRequired,
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

  setRoomDescription(description) {
    const {setRoomDescription, channel} = this.props
    setRoomDescription(channel.id, description)
  }

  renameRoom(name) {
    const {renameRoom, channel} = this.props
    renameRoom(channel.id, name)
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
          <article className={classes.mainSettings}>
            <div className={classes.roomName}>
              <EditableString
                placeholder="Enter group name here…"
                maxLength={maxChannelNameLength}
                onSave={::this.renameRoom}
                value={channel.name}
                error={roomSettings.nameError}
                />
            </div>
            <div className={classes.menu}>
              <button ref="settings">(**)</button>
              <Dropdown
                container={this}
                placement="bottom"
                target={() => findDOMNode(this.refs.settings)}>
                <div>
                  I'm placed to the: <strong>asdasd</strong>
                </div>
              </Dropdown>
            </div>
          </article>

          <article className={classes.roomDescription}>
            <h2 className={classes.title}>
              Description
            </h2>
            <EditableString
              placeholder="Add a group description here…"
              maxLength={maxChannelDescriptionLength}
              type={'textarea'}
              onSave={::this.setRoomDescription}
              value={channel.description}
              />
          </article>

          <article className={classes.actions}>
            <button
              onClick={::this.onInvite}
              className={classes.buttonInvite}>
              Invite more people to this group
            </button>
            <button
              onClick={::this.onLeave}
              className={classes.buttonLeave}>
              Leave {channel.name}
            </button>
          </article>

          {channel.users.map(::this.renderUser)}

        </div>
      </SidebarPanel>
    )
  }
}
