import React, {PureComponent, PropTypes} from 'react'
import isEmpty from 'lodash/lang/isEmpty'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import {constants} from 'conf'
import injectSheet from 'grape-web/lib/jss'
import colors from 'grape-theme/dist/base-colors'

import {maxChannelDescriptionLength, userStatusMap} from '../../constants/app'
import {Description} from '../i18n/i18n'
import EditableText from '../editable-text/EditableText'
import {styles} from './roomInfoTheme.js'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import MainSettings from './MainSettings'
import {Username} from '../avatar-name'

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

const getRoles = ({channel, user}) => {
  const isAdmin = user.role >= constants.roles.ROLE_ADMIN
  const isCreator = channel.creator && user.id === channel.creator
  return {
    isAdmin,
    isCreator,
    allowEdit: isAdmin || isCreator
  }
}

class User extends PureComponent {
  renderDeleteButton() {
    const {channel, user, currUser, sheet: {classes}} = this.props
    const {isAdmin, isCreator} = getRoles({channel, user: currUser})
    const isSelf = currUser.id === user.id
    const hasCreated = channel.creator === user.id
    const isKickMaster = (isAdmin || isCreator) && !isSelf

    if (!isKickMaster || isSelf || hasCreated) return null

    return (
      <button
        className={classes.buttonKick}
        onClick={this.onKickMember}>
      </button>
    )
  }


  onKickMember = () => {
    const {kickMemberFromChannel, channel, user} = this.props
    kickMemberFromChannel({
      channelId: channel.id,
      userId: user.id
    })
  }

  onSelectMember = () => {
    const {user, goToChannel} = this.props
    goToChannel(user.slug)
  }

  render() {
    const {sheet: {classes}, user} = this.props

    return (
      <div key={user.id} className={classes.row}>
        <div
          className={classes.userName}
          onClick={this.onSelectMember}>
          <Username
            statusBorderColor={colors.grayBlueLighter}
            avatar={user.avatar}
            status={userStatusMap[user.status]}
            name={user.displayName} />
        </div>
        {this.renderDeleteButton()}
      </div>
    )
  }
}

@injectSheet(styles)
@injectIntl
export default class RoomInfo extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    showChannelMembersInvite: PropTypes.func.isRequired,
    showNotificationSettings: PropTypes.func.isRequired,
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
    hideSidebar: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    notificationSettings: PropTypes.object.isRequired
  }

  componentWillMount() {
    const {load, channel} = this.props
    load({channel})
  }

  componentWillReceiveProps(nextProps) {
    const {channel, load} = this.props
    const channelHasChanged = channel !== nextProps.channel
    if (channelHasChanged) load({channel: nextProps.channel})
  }

  onInvite = () => {
    this.props.showChannelMembersInvite(this.props.channel)
  }

  onAddIntegration = () => {
    this.props.goToAddIntegrations()
  }

  onLeave = () => {
    this.props.leaveChannel(this.props.channel.id)
  }

  onClose = () => {
    this.props.hideSidebar()
  }

  onChangePrivacy = () => {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onShowRoomDeleteDialog = (room) => {
    this.props.showRoomDeteteDialog(room)
  }

  onSetRoomColor = (color) => {
    const {setRoomColor, channel} = this.props
    setRoomColor(channel.id, color)
  }

  onSetRoomIcon = (icon) => {
    const {setRoomIcon, channel} = this.props
    setRoomIcon(channel.id, icon)
  }

  onSetRoomDescription = (description) => {
    const {setRoomDescription, channel} = this.props
    setRoomDescription(channel.id, description)
  }

  onRenameRoom = (name) => {
    const {renameRoom, channel} = this.props
    renameRoom(channel.id, name)
  }

  renderDescriptionEditable() {
    const {channel, user, intl: {formatMessage}} = this.props
    const {allowEdit} = getRoles({channel, user})

    if (!allowEdit) return <p>{channel.description}</p>

    return (
      <EditableText
        placeholder={formatMessage(messages.placeholder)}
        maxLength={maxChannelDescriptionLength}
        onSave={this.onSetRoomDescription}
        value={channel.description}
        preserveSpaceForButton
        multiline />
    )
  }

  renderDescription() {
    const {channel, user, sheet: {classes}} = this.props
    const {allowEdit} = getRoles({channel, user})

    if (!allowEdit && !channel.description) return null

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
    const {
      channel, renameError, clearRoomRenameError,
      intl: {formatMessage},
      sheet, sheet: {classes},
      showNotificationSettings, notificationSettings,
      user: currUser,
      goToChannel, kickMemberFromChannel
    } = this.props

    if (isEmpty(channel)) return null

    const {allowEdit} = getRoles({channel, user: currUser})

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={this.onClose}>
        <div className={classes.channelInfo}>
          <MainSettings
            channel={channel}
            clearRoomRenameError={clearRoomRenameError}
            renameError={renameError}
            allowEdit={allowEdit}
            onSetRoomColor={this.onSetRoomColor}
            onSetRoomIcon={this.onSetRoomIcon}
            onChangePrivacy={this.onChangePrivacy}
            onShowRoomDeleteDialog={this.onShowRoomDeleteDialog}
            renameRoom={this.onRenameRoom}
            notificationSettings={notificationSettings}
            showNotificationSettings={showNotificationSettings}
            theme={sheet} />

          {this.renderDescription()}

          <article className={classes.actions}>
            <ul>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onInvite}
                  className={classes.buttonInvite}>
                    <FormattedMessage
                      id="inviteMoreToGroup"
                      defaultMessage="Invite more people to this group" />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onAddIntegration}
                  className={classes.buttonIntegration}>
                  <FormattedMessage
                    id="addServiceIntegration"
                    defaultMessage="Add service integration" />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onLeave}
                  className={classes.buttonLeave}>
                  <FormattedMessage
                    id="leaveChannel"
                    defaultMessage="Leave {channel}"
                    values={{channel: channel.name}} />
                </button>
              </li>
            </ul>
          </article>
          {channel.users.map(user => (
            <User
              key={user.id}
              user={user}
              channel={channel}
              currUser={currUser}
              sheet={sheet}
              goToChannel={goToChannel}
              kickMemberFromChannel={kickMemberFromChannel} />
          ))}
        </div>
      </SidebarPanel>
    )
  }
}
