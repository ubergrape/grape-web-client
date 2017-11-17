import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/lang/isEmpty'
import find from 'lodash/collection/find'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {SharedFiles as SharedFilesText} from '../../i18n'
import SidebarPanel from '../SidebarPanel'
import Divider from '../Divider'
import SharedFiles from '../shared-files/SharedFiles'
import PinnedMessages from '../pinned-messages/PinnedMessages'
import TabbedContent from '../TabbedContent'
import MainSettings from './MainSettings'
import User from './User'
import RoomActions from './RoomActions'
import Description from './Description'
import {getRoles} from './utils'
import {styles} from './roomInfoTheme.js'

const title = (
  <FormattedMessage
    id="groupInfo"
    defaultMessage="Group Info"
  />
)

const tabs = [
  {
    name: 'pinnedMessages',
    icon: 'pinFilled',
    render: 'renderPinnedMessages',
    title: (
      <FormattedMessage
        id="pinnedMesages"
        defaultMessage="Pinned Messages"
      />
    )
  },
  {
    name: 'members',
    icon: 'accountGroup',
    render: 'renderMembers',
    title: (
      <FormattedMessage
        id="members"
        defaultMessage="Members"
      />
    )
  },
  {
    name: 'files',
    icon: 'folderPicture',
    render: 'renderSharedFiles',
    title: <SharedFilesText />
  }
]

@injectSheet(styles)
export default class RoomInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    showSubview: PropTypes.string,
    subview: PropTypes.object,
    showChannelMembersInvite: PropTypes.func.isRequired,
    showNotificationSettings: PropTypes.func.isRequired,
    onOpenSharedFile: PropTypes.func,
    onLoadSharedFiles: PropTypes.func.isRequired,
    onLoadPinnedMessages: PropTypes.func.isRequired,
    onSelectPinnedMessage: PropTypes.func.isRequired,
    onShowSubview: PropTypes.func.isRequired,
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
    renameError: null,
    showSubview: 'pinnedMessages',
    subview: undefined,
    onOpenSharedFile: undefined
  }

  componentDidMount() {
    const {onLoad, onShowSubview, channel} = this.props
    onShowSubview(tabs[0].name)
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

  onLeave = () => {
    this.props.leaveChannel(this.props.channel.id)
  }

  onChangePrivacy = () => {
    const {setRoomPrivacy, channel} = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
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

  onChangeTab = (index) => {
    this.props.onShowSubview(tabs[index].name)
  }

  renderMembers = () => {
    const {
      channel, goToAddIntegrations, user: currUser, goToChannel,
      kickMemberFromChannel
    } = this.props

    return (
      <div>
        <RoomActions
          channel={channel}
          onLeave={this.onLeave}
          onInvite={this.onInvite}
          onAddIntegration={goToAddIntegrations}
        />
        <Divider />
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
    )
  }

  renderSharedFiles = () => {
    const {onLoadSharedFiles, onOpenSharedFile, subview} = this.props

    return (
      <SharedFiles
        {...subview}
        onLoad={onLoadSharedFiles}
        onOpen={onOpenSharedFile}
      />
    )
  }

  renderPinnedMessages = () => {
    const {onLoadPinnedMessages, onSelectPinnedMessage, subview, user} = this.props

    return (
      <PinnedMessages
        {...subview}
        user={user}
        onLoad={onLoadPinnedMessages}
        onSelect={onSelectPinnedMessage}
      />
    )
  }

  render() {
    const {
      channel, renameError, clearRoomRenameError,
      classes,
      showNotificationSettings, notificationSettings,
      showRoomDeleteDialog,
      user: currUser,
      showSubview,
      onClose
    } = this.props

    if (isEmpty(channel)) return null

    const {allowEdit} = getRoles({channel, user: currUser})
    const tab = find(tabs, {name: showSubview})

    return (
      <SidebarPanel
        title={title}
        onClose={onClose}
      >
        <div className={classes.roomInfo}>
          <MainSettings
            classes={classes}
            channel={channel}
            clearRoomRenameError={clearRoomRenameError}
            renameError={renameError}
            allowEdit={allowEdit}
            onSetRoomColor={this.onSetRoomColor}
            onSetRoomIcon={this.onSetRoomIcon}
            onChangePrivacy={this.onChangePrivacy}
            onShowRoomDeleteDialog={showRoomDeleteDialog}
            renameRoom={this.onRenameRoom}
            notificationSettings={notificationSettings}
            showNotificationSettings={showNotificationSettings}
          />
          <Divider inset />
          <Description
            description={channel.description}
            allowEdit={allowEdit}
            onSetRoomDescription={this.onSetRoomDescription}
            className={classes.description}
          />
          <TabbedContent
            index={tabs.indexOf(tab)}
            onChange={this.onChangeTab}
            tabs={tabs}
            title={tab.title}
            body={this[tab.render]()}
          />
        </div>
      </SidebarPanel>
    )
  }
}
