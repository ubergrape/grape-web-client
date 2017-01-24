import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {manageGroupsSelector as selector} from '../../selectors'
import {ManageGroupsDialog} from '../../components/manage-groups'

const actionNames = {
  goToChannel: 'onJoin',
  leaveChannel: 'onLeave',
  setManageGroupsFilter: 'onSelectFilter',
  hideManageGroups: 'onHide',
  showNewConversation: 'createNewGroup'
}

const ConnectedManageGroupsDialog = connect(
  selector,
  mapActionsToProps(actionNames)
)(ManageGroupsDialog)

export default class ManageGroupsDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedManageGroupsDialog />
      </Provider>
    )
  }
}
