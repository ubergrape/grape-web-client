import React, {Component, PropTypes} from 'react'
import {shallowEqual} from 'react-pure-render'
import isEmpty from 'lodash/lang/isEmpty'
import {maxChannelDescriptionLength} from '../../constants/app'

import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import EditableString from '../editable-string/EditableString'
import MainSettings from './MainSettings'

@useSheet(style)
export default class RoomInfo extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    roomSettings: PropTypes.object.isRequired,
    showChannelMembersInvite: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToAddIntegrations: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    renameRoom: PropTypes.func.isRequired,
    setRoomDescription: PropTypes.func.isRequired,
    setRoomPrivacy: PropTypes.func.isRequired,
    showRoomDeteteDialog: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      ...this.getRoles(props)
    }
  }

  componentWillReceiveProps(nextProps) {
    const userSame = shallowEqual(this.props.user, nextProps.user)
    const channelSame = shallowEqual(this.props.channel, nextProps.channel)
    if (userSame && channelSame) return
    this.setState({...this.state, ...this.getRoles(nextProps)})
  }

  onInvite() {
    this.props.showChannelMembersInvite(this.props.channel)
  }

  onAddIntegration() {
    this.props.goToAddIntegrations()
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

  onPrivacyChange() {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onShowRoomDeleteDialog(room) {
    this.props.showRoomDeteteDialog(room)
  }

  setRoomDescription(description) {
    const {setRoomDescription, channel} = this.props
    setRoomDescription(channel.id, description)
  }

  getRoles({channel, user}) {
    const isAdmin = user.role >= constants.roles.ROLE_ADMIN
    const isCreator = channel.creator && user.id === channel.creator
    return {
      isAdmin,
      isCreator,
      allowEdit: isAdmin || isCreator
    }
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
    const {channel} = this.props
    const {classes} = this.props.sheet
    const {isAdmin, isCreator} = this.state
    const currUser = this.props.user
    const isSelf = currUser.id === user.id
    const hasCreated = channel.creator === user.id
    const isKickMaster = (isAdmin || isCreator) && !isSelf

    if (!isKickMaster || isSelf || hasCreated) return null
    return (
      <button
        className={classes.buttonKick}
        onClick={this.onKickMember.bind(this, user)}>
      </button>
    )
  }

  renderDescriptionEditable(allowEdit) {
    const {channel} = this.props
    if (!allowEdit) return <p>{channel.description}</p>
    return (
      <EditableString
        placeholder="Add a group description here…"
        maxLength={maxChannelDescriptionLength}
        type={'textarea'}
        onSave={::this.setRoomDescription}
        value={channel.description}
        />
    )
  }

  renderDescription(allowEdit) {
    const {channel, sheet} = this.props

    if (!allowEdit && !channel.description) return null

    const {classes} = sheet
    return (
      <article className={classes.roomDescription}>
        <h2 className={classes.title}>Description</h2>
        {this.renderDescriptionEditable(allowEdit)}
      </article>
    )
  }

  render() {
    const {channel, roomSettings} = this.props
    if (isEmpty(channel)) return null

    const {classes} = this.props.sheet
    const {allowEdit} = this.state

    return (
      <SidebarPanel
        title="Group Info"
        onClose={::this.onClose}>
        <div className={classes.channelInfo}>
          <MainSettings
            allowEdit={allowEdit}
            channel={channel}
            onPrivacyChange={::this.onPrivacyChange}
            onShowRoomDeleteDialog={::this.onShowRoomDeleteDialog}
            renameRoom={::this.renameRoom}
            roomSettings={roomSettings}
            classes={classes} />

          {this.renderDescription(allowEdit)}

          <article className={classes.actions}>
            <ul>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onInvite}
                  className={classes.buttonInvite}>
                  Invite more people to this group
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onAddIntegration}
                  className={classes.buttonIntegration}>
                  Add service integration
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onLeave}
                  className={classes.buttonLeave}>
                  Leave {channel.name}
                </button>
              </li>
            </ul>
          </article>

          {channel.users.map(::this.renderUser)}

        </div>
      </SidebarPanel>
    )
  }
}
