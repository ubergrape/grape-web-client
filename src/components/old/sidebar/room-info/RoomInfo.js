import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import { FormattedMessage } from 'react-intl'
import injectSheet from 'grape-web/lib/jss'

import {
  SharedFiles as SharedFilesText,
  PinnedMessages as PinnedMessagesText,
  GroupInfo as GroupInfoText,
} from '../../i18n'
import SidebarPanel from '../SidebarPanel'
import Divider from '../Divider'
import SharedFiles from '../shared-files/SharedFiles'
import PinnedMessages from '../pinned-messages/PinnedMessages'
import ChannelMembers from '../channel-members/ChannelMembers'
import TabbedContent from '../TabbedContent'
import MainSettings from './MainSettings'
import RoomActions from './RoomActions'
import Description from './Description'
import { styles } from './roomInfoTheme.js'

const tabs = [
  {
    name: 'pinnedMessages',
    icon: 'pinFilled',
    render: 'renderPinnedMessages',
    title: <PinnedMessagesText />,
  },
  {
    name: 'members',
    icon: 'accountGroup',
    render: 'renderMembers',
    title: <FormattedMessage id="members" defaultMessage="Members" />,
  },
  {
    name: 'files',
    icon: 'folderPicture',
    render: 'renderSharedFiles',
    title: <SharedFilesText />,
  },
]

class RoomInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object,
    channel: PropTypes.object.isRequired,
    permissions: PropTypes.object,
    customEmojis: PropTypes.object,
    user: PropTypes.object.isRequired,
    renameError: PropTypes.object,
    showSubview: PropTypes.string,
    subview: PropTypes.object,
    showChannelMembersInvite: PropTypes.func.isRequired,
    searchUsersToInvite: PropTypes.func.isRequired,
    showNotificationSettings: PropTypes.func.isRequired,
    onOpenSharedFile: PropTypes.func,
    onLoadSharedFiles: PropTypes.func.isRequired,
    onLoadPinnedMessages: PropTypes.func.isRequired,
    onLoadMembers: PropTypes.func.isRequired,
    onSelectPinnedMessage: PropTypes.func.isRequired,
    onShowSubview: PropTypes.func.isRequired,
    kickMemberFromChannel: PropTypes.func.isRequired,
    goToAddIntegrations: PropTypes.func.isRequired,
    openPm: PropTypes.func.isRequired,
    renameRoom: PropTypes.func.isRequired,
    setRoomDescription: PropTypes.func.isRequired,
    setRoomPrivacy: PropTypes.func.isRequired,
    setRoomColor: PropTypes.func.isRequired,
    setRoomIcon: PropTypes.func.isRequired,
    clearRoomRenameError: PropTypes.func.isRequired,
    showRoomDeleteDialog: PropTypes.func.isRequired,
    onLeaveChannel: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onUnpin: PropTypes.func.isRequired,
    notificationSettings: PropTypes.object.isRequired,
    sidebarRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  }

  static defaultProps = {
    renameError: null,
    colors: {},
    showSubview: 'pinnedMessages',
    subview: undefined,
    onOpenSharedFile: undefined,
    sidebarRef: undefined,
    permissions: {},
    customEmojis: {},
  }

  componentDidMount() {
    const { onLoad, onShowSubview, channel } = this.props
    onShowSubview(tabs[0].name)
    onLoad({ channel })
  }

  componentWillReceiveProps(nextProps) {
    const { channel, onLoad } = this.props
    const channelHasChanged = channel !== nextProps.channel
    if (channelHasChanged) onLoad({ channel: nextProps.channel })
  }

  onInvite = () => {
    this.props.searchUsersToInvite('')
    this.props.showChannelMembersInvite(this.props.channel)
  }

  onLeave = () => {
    const { onLeaveChannel, channel } = this.props
    onLeaveChannel(channel.id, !channel.isPublic)
  }

  onChangePrivacy = () => {
    const { setRoomPrivacy, channel } = this.props
    setRoomPrivacy(channel.id, !channel.isPublic)
  }

  onSetRoomColor = color => {
    const { setRoomColor, channel } = this.props
    setRoomColor(channel.id, color)
  }

  onSetRoomIcon = icon => {
    const { setRoomIcon, channel } = this.props
    setRoomIcon(channel.id, icon)
  }

  onSetRoomDescription = description => {
    const { setRoomDescription, channel } = this.props
    setRoomDescription(channel.id, description)
  }

  onRenameRoom = name => {
    const { renameRoom, channel } = this.props
    renameRoom(channel.id, name)
  }

  onChangeTab = index => {
    this.props.onShowSubview(tabs[index].name)
  }

  renderMembers = () => {
    const {
      channel,
      colors,
      goToAddIntegrations,
      user,
      openPm,
      kickMemberFromChannel,
      subview: { users, isEveryMemberLoaded },
      onLoadMembers,
      permissions,
      sidebarRef,
    } = this.props

    return (
      <div>
        <RoomActions
          channel={channel}
          colors={colors}
          permissions={permissions}
          onLeave={this.onLeave}
          onInvite={this.onInvite}
          onAddIntegration={goToAddIntegrations}
        />
        {(permissions.canLeaveChannel ||
          permissions.canInviteMembers ||
          permissions.canInviteGuests ||
          permissions.canAddIntegration) &&
          permissions.canSeeMembersList && <Divider />}
        {permissions.canSeeMembersList && (
          <ChannelMembers
            channel={channel}
            colors={colors}
            onLoad={onLoadMembers}
            onOpen={openPm}
            onKick={kickMemberFromChannel}
            currUser={user}
            users={users}
            isEveryMemberLoaded={isEveryMemberLoaded}
            sidebarRef={sidebarRef}
            permissions={permissions}
          />
        )}
      </div>
    )
  }

  renderSharedFiles = () => {
    const { onLoadSharedFiles, onOpenSharedFile, subview } = this.props

    return (
      <SharedFiles
        {...subview}
        onLoad={onLoadSharedFiles}
        onOpen={onOpenSharedFile}
      />
    )
  }

  renderPinnedMessages = () => {
    const {
      onLoadPinnedMessages,
      onSelectPinnedMessage,
      onUnpin,
      subview,
      user,
      customEmojis,
    } = this.props

    return (
      <PinnedMessages
        {...subview}
        user={user}
        customEmojis={customEmojis}
        onLoad={onLoadPinnedMessages}
        onSelect={onSelectPinnedMessage}
        onUnpin={onUnpin}
      />
    )
  }

  render() {
    const {
      channel,
      renameError,
      clearRoomRenameError,
      classes,
      colors,
      showNotificationSettings,
      notificationSettings,
      showRoomDeleteDialog,
      showSubview,
      onClose,
      permissions,
    } = this.props

    if (isEmpty(channel)) return null

    const tab = find(tabs, { name: showSubview })

    return (
      <SidebarPanel colors={colors} title={<GroupInfoText />} onClose={onClose}>
        <div className={classes.roomInfo}>
          <MainSettings
            classes={classes}
            channel={channel}
            colors={colors}
            clearRoomRenameError={clearRoomRenameError}
            renameError={renameError}
            allowEdit={permissions.canEditChannel}
            allowDelete={permissions.canDeleteChannel}
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
            allowEdit={permissions.canEditChannel}
            colors={colors}
            onSetRoomDescription={this.onSetRoomDescription}
            className={classes.description}
            isPublic={channel.isPublic}
          />
          <TabbedContent
            index={tabs.indexOf(tab)}
            onChange={this.onChangeTab}
            tabs={tabs}
            colors={colors}
            title={tab.title}
            body={this[tab.render]()}
          />
        </div>
      </SidebarPanel>
    )
  }
}

export default injectSheet(styles)(RoomInfo)
