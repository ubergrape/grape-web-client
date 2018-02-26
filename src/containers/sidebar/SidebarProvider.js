import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {sidebarComponentSelector as selector} from '../../selectors'
import {Sidebar} from '../../components/sidebar'

const actionNames = [
  'hideSidebar',
  'showSidebarSubview',
  'leaveChannel',
  'goToChannel',
  'openPm',
  'kickMemberFromChannel',
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
  'unpinMessage'
]

const ConnectedSidebar = connect(
  selector,
  mapActionsToProps(actionNames)
)(Sidebar)

export default class SidebarProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedSidebar {...this.props} />
      </Provider>
    )
  }
}
