import React, {PureComponent, PropTypes} from 'react'
import isEmpty from 'lodash/lang/isEmpty'
import {
  FormattedMessage,
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {maxChannelDescriptionLength} from '../../../constants/app'
import {Description} from '../../i18n'
import EditableText from '../../editable-text/EditableText'
import SidebarPanel from '../sidebar-panel/SidebarPanel'
import MainSettings from './MainSettings'
import {styles} from './roomInfoTheme.js'
import User from './User'
import {getRoles} from './utils'

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

@injectSheet(styles)
@injectIntl
export default class RoomInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    showRoomDeleteDialog: PropTypes.func.isRequired,
    leaveChannel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    notificationSettings: PropTypes.object.isRequired
  }

  static defaultProps = {
    renameError: null
  }

  componentWillMount() {
    const {onLoad, channel} = this.props
    onLoad({channel})
  }

  componentWillReceiveProps(nextProps) {
    const {channel, onLoad} = this.props
    const channelHasChanged = channel !== nextProps.channel
    if (channelHasChanged) onLoad({channel: nextProps.channel})
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
    this.props.onClose()
  }

  onChangePrivacy = () => {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onShowRoomDeleteDialog = (room) => {
    this.props.showRoomDeleteDialog(room)
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
        multiline
      />
    )
  }

  renderDescription() {
    const {channel, user, classes} = this.props
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
      classes,
      showNotificationSettings, notificationSettings,
      user: currUser,
      goToChannel, kickMemberFromChannel
    } = this.props

    if (isEmpty(channel)) return null

    const {allowEdit} = getRoles({channel, user: currUser})

    return (
      <SidebarPanel
        title={formatMessage(messages.title)}
        onClose={this.onClose}
      >
        <div className={classes.channelInfo}>
          <MainSettings
            classes={classes}
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
          />

          {this.renderDescription()}

          <article className={classes.actions}>
            <ul>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onInvite}
                  className={classes.buttonInvite}
                >
                  <FormattedMessage
                    id="inviteMoreToGroup"
                    defaultMessage="Invite more people to this group"
                    description="Room Info Panel: link to invite people to the group/room"
                  />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onAddIntegration}
                  className={classes.buttonIntegration}
                >
                  <FormattedMessage
                    id="addServiceIntegration"
                    defaultMessage="Add service integration"
                    description="Room Info Panel: link to add an integration to the current room"
                  />
                </button>
              </li>
              <li className={classes.actionItem}>
                <button
                  onClick={this.onLeave}
                  className={classes.buttonLeave}
                >
                  <FormattedMessage
                    id="leaveChannel"
                    defaultMessage="Leave {channel}"
                    values={{channel: channel.name}}
                    description="Room Info Panel: leave room link"
                  />
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
              goToChannel={goToChannel}
              kickMemberFromChannel={kickMemberFromChannel}
            />
          ))}
        </div>
      </SidebarPanel>
    )
  }
}
