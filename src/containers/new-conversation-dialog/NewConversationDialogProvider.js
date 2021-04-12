import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'
import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationComponentSelector as selector } from '../../selectors'
import { NewConversationDialog } from '../../components/new-conversation-dialog'

const actionNames = {
  showNewConversation: 'showNewConversation',
  hideNewConversation: 'hideNewConversation',
  setNewConversationTab: 'setNewConversationTab',
  onSearchPeople: 'onSearchPeople',
  onChangePeopleQuery: 'onChangePeopleQuery',
  onSearchGroups: 'onSearchGroups',
  onChangeGroupsQuery: 'onChangeGroupsQuery',
  goToChannel: 'goToChannel',
  joinChannel: 'joinChannel',
  openPm: 'openPm',
  showCreateRoom: 'showCreateRoom',
  hideCreateRoom: 'hideCreateRoom',
  setIsPrivate: 'setIsPrivate',
  onGroupNameChange: 'onGroupNameChange',
  onGroupDescriptionChange: 'onGroupDescriptionChange',
  onChangeMembersQuery: 'onChangeMembersQuery',
  onSearchMembers: 'onSearchMembers',
  onMemberSelect: 'onMemberSelect',
  onMemberRemove: 'onMemberRemove',
  onCreateRoom: 'onCreateRoom',
  showInviteToOrg: 'showInviteToOrg',
  onCurrentSelectedMemberChange: 'onCurrentSelectedMemberChange',
}

const ConnectedNewConversationDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(NewConversationDialog)

export default class NewConversationDialogProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedNewConversationDialog />
      </Provider>
    )
  }
}
