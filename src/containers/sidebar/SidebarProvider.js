import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {sidebarComponentSelector as selector} from '../../selectors'
import Sidebar from '../../components/sidebar/Sidebar'

const actionNames = [
  'hideSidebar',
  'leaveChannel',
  'goToChannel',
  'kickMemberFromChannel',
  'showChannelMembersInvite',
  'loadSharedFiles',
  'loadMentions',
  'loadRoomInfo',
  'goToMessage',
  'searchMessages',
  'toggleSearchOnlyInChannel',
  'toggleShowRoomMentions',
  'renameRoom',
  'setRoomDescription',
  'setRoomPrivacy',
  'setRoomColor',
  'setRoomIcon',
  'clearRoomRenameError',
  'showRoomDeteteDialog',
  'goToAddIntegrations',
  'showNotificationSettings'
]

const ConnectedSidebar = connect(
  selector,
  mapActionsToProps(actionNames)
)(Sidebar)

export default class SidebarProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedSidebar />
      </Provider>
    )
  }
}
