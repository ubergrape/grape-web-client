import React, {Component, PropTypes} from 'react'
import isEmpty from 'lodash/lang/isEmpty'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import {constants} from 'conf'
import {useSheet} from 'grape-web/lib/jss'

import {maxChannelDescriptionLength} from '../../constants/app'
import {Description} from '../i18n/i18n'
import EditableText from '../editable-text/EditableText'
import style from './style'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import MainSettings from './MainSettings'

const messages = defineMessages({
  placeholder: {
    id: 'addGroupDescription',
    defaultMessage: 'Add a group description here…'
  },
  title: {
    id: 'groupInfo',
    defaultMessage: 'Group Info'
  }
})

@useSheet(style)
@injectIntl
export default class RoomInfo extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    showChannelMembersInvite: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToAddIntegrations: PropTypes.func.isRequired,
    goToChannel: PropTypes.func.isRequired,
    renameRoom: PropTypes.func.isRequired,
    setRoomDescription: PropTypes.func.isRequired,
    setRoomPrivacy: PropTypes.func.isRequired,
    setRoomColor: PropTypes.func.isRequired,
    setRoomIcon: PropTypes.func.isRequired,
    clearRoomRenameError: PropTypes.func.isRequired,
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
    const isSameUser = this.props.user === nextProps.user
    const isSameChannel = this.props.channel === nextProps.channel
    if (isSameUser && isSameChannel) return
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

  onChangePrivacy() {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onShowRoomDeleteDialog(room) {
    this.props.showRoomDeteteDialog(room)
  }

  onSetRoomColor(color) {
    const {setRoomColor, channel} = this.props
    setRoomColor(channel.id, color)
  }

  onSetRoomIcon(icon) {
    const {setRoomIcon, channel} = this.props
    setRoomIcon(channel.id, icon)
  }

  onSetRoomDescription(description) {
    const {setRoomDescription, channel} = this.props
    setRoomDescription(channel.id, description)
  }

  onRenameRoom(name) {
    const {renameRoom, channel} = this.props
    renameRoom(channel.id, name)
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

  renderDescriptionEditable() {
    const {channel, intl} = this.props
    if (!this.state.allowEdit) return <p>{channel.description}</p>
    return (
      <EditableText
        placeholder={intl.formatMessage(messages.placeholder)}
        maxLength={maxChannelDescriptionLength}
        onSave={::this.onSetRoomDescription}
        value={channel.description}
        multiline />
    )
  }

  renderDescription() {
    const {channel, sheet} = this.props

    if (!this.state.allowEdit && !channel.description) return null

    const {classes} = sheet
    return (
      <article className={classes.roomDescription}>
        <h2 className={classes.title}>
          <Description />
        </h2>
        {this.renderDescriptionEditable()}
      </article>
    )
  }

  render() {
    const {channel, renameError, clearRoomRenameError, intl} = this.props
    if (isEmpty(channel)) return null

    const {classes} = this.props.sheet
    const {allowEdit} = this.state

    return (
      <SidebarPanel
        title={intl.formatMessage(messages.title)}
        onClose={::this.onClose}>
        <div className={classes.channelInfo}>
          <MainSettings
            channel={channel}
            clearRoomRenameError={clearRoomRenameError}
            renameError={renameError}
            allowEdit={allowEdit}
            onSetRoomColor={::this.onSetRoomColor}
            onSetRoomIcon={::this.onSetRoomIcon}
            onChangePrivacy={::this.onChangePrivacy}
            onShowRoomDeleteDialog={::this.onShowRoomDeleteDialog}
            renameRoom={::this.onRenameRoom}
            classes={classes} />

          {this.renderDescription()}

          <article className={classes.actions}>
            <ul>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onInvite}
                  className={classes.buttonInvite}>
                    <FormattedMessage
                      id="inviteMoreToGroup"
                      defaultMessage="Invite more people to this group" />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onAddIntegration}
                  className={classes.buttonIntegration}>
                  <FormattedMessage
                    id="addServiceIntegration"
                    defaultMessage="Add service integration" />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={::this.onLeave}
                  className={classes.buttonLeave}>
                  <FormattedMessage
                    id="leaveChannel"
                    defaultMessage="Leave" />
                  {` ${channel.name}`}
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
