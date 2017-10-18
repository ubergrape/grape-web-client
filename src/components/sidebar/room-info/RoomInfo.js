import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import isEmpty from 'lodash/lang/isEmpty'
import {
  defineMessages,
  intlShape,
  injectIntl
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import SidebarPanel from '../sidebar-panel/SidebarPanel'
import MainSettings from './MainSettings'
import User from './User'
import RoomActions from './RoomActions'
import Description from './Description'
import {getRoles} from './utils'
import {styles} from './roomInfoTheme.js'

const messages = defineMessages({
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

  render() {
    const {
      channel, renameError, clearRoomRenameError,
      intl: {formatMessage},
      intl,
      classes,
      showNotificationSettings, notificationSettings,
      user: currUser,
      goToChannel, kickMemberFromChannel,
      goToAddIntegrations
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
          <Description
            classes={classes}
            description={channel.description}
            intl={intl}
            allowEdit={allowEdit}
            onSetRoomDescription={this.onSetRoomDescription}
          />
          <RoomActions
            classes={classes}
            channel={channel}
            onLeave={this.onLeave}
            onInvite={this.onInvite}
            onAddIntegration={goToAddIntegrations}
          />
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
