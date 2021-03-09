import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'
import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationComponentSelector as selector } from '../../selectors'
import { NewConversationDialog } from '../../components/new-conversation-dialog'

const actionNames = {
  showNewConversation: 'showNewConversation',
  hideNewConversation: 'hideNewConversation',
  onSearchGroupsNewConversation: 'onSearchGroups',
  onChangeGroupsQueryNewConversation: 'onChangeGroupsQuery',
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
