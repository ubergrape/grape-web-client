import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { manageGroupsComponentSelector as selector } from '../../selectors'
import { ManageGroupsDialog } from '../../components/manage-groups'

const actionNames = {
  joinChannel: 'onJoin',
  leaveChannel: 'onLeave',
  selectManageGroupsFilter: 'onSelectFilter',
  hideManageGroups: 'onHide',
  showNewConversation: 'createNewGroup',
  loadManageGroupsChannels: 'onLoad',
}

const ConnectedManageGroupsDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(ManageGroupsDialog)

export default () => (
  <Provider store={getStore()}>
    <ConnectedManageGroupsDialog />
  </Provider>
)
