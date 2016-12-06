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

import {maxChannelDescriptionLength} from '../../constants/app'
import {Description} from '../i18n/i18n'
import EditableText from '../editable-text/EditableText'
import {styles} from './roomInfoTheme.js'
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

  constructor(props) {
    super(props)

    this.state = {
      ...this.getRoles(props)
    }
  }

  componentWillMount() {
    const {load, channel} = this.props
    load({channel})
  }

  componentWillReceiveProps(nextProps) {
    const {user, channel, load} = this.props
    const userHasChanged = user !== nextProps.user
    const channelHasChanged = channel !== nextProps.channel
    if (userHasChanged || channelHasChanged) {
      this.setState({...this.state, ...this.getRoles(nextProps)})
    }
    if (channelHasChanged) load({channel: nextProps.channel})
  }

  onInvite = () => {
    this.props.showChannelMembersInvite(this.props.channel)
  }

  onAddIntegration = () => {
    this.props.goToAddIntegrations()
  }

  onKickMember = (user) => {
    this.props.kickMemberFromChannel({
      channelId: this.props.channel.id,
      userId: user.id
    })
  }

  onSelectMember = (user) => {
    this.props.goToChannel(user.slug)
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
          onClick={/* TODO #120 */this.onSelectMember.bind(this, user)} />
        <span
          className={classes.name}
          onClick={/* TODO #120 */this.onSelectMember.bind(this, user)}>
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
        onClick={/* TODO #120 */this.onKickMember.bind(this, user)}>
      </button>
    )
  }

  renderDescriptionEditable() {
    const {channel, intl: {formatMessage}} = this.props
    if (!this.state.allowEdit) return <p>{channel.description}</p>
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
    const {
      channel, renameError, clearRoomRenameError,
      intl: {formatMessage},
      sheet, sheet: {classes},
      showNotificationSettings, notificationSettings
    } = this.props

    if (isEmpty(channel)) return null

    const {allowEdit} = this.state

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
          {channel.users.map(this.renderUser, this)}
        </div>
      </SidebarPanel>
    )
  }
}
