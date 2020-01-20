import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { sidebarComponentSelector as selector } from '../../selectors'
import { Sidebar } from '../../components/sidebar'

const actionNames = [
  'hideSidebar',
  'showSidebarSubview',
  'onLeaveChannel',
  'goToChannel',
  'openPm',
  'kickMemberFromChannel',
  'searchUsersToInvite',
  'showChannelMembersInvite',
  'loadSharedFiles',
  'loadPinnedMessages',
  'loadMentions',
  'loadRoomInfo',
  'loadChannelMembers',
  'loadLabeledMessages',
  'selectLabeledMessagesFilter',
  'goToMessage',
  'searchMessages',
  'toggleSearchOnlyInChannel',
  'toggleSearchActivities',
  'toggleShowRoomMentions',
  'toggleShowCurrentRoomMentions',
  'renameRoom',
  'setRoomDescription',
  'setRoomPrivacy',
  'setRoomColor',
  'setRoomIcon',
  'clearRoomRenameError',
  'showRoomDeleteDialog',
  'goToAddIntegrations',
  'showNotificationSettings',
  'openSharedFile',
  'unpinMessage',
  'getUser',
]

const ConnectedSidebar = connect(
  selector,
  mapActionsToProps(actionNames),
)(Sidebar)

const SidebarProvider = props => (
  <Provider store={getStore()}>
    <ConnectedSidebar {...props} />
  </Provider>
)

export default SidebarProvider
