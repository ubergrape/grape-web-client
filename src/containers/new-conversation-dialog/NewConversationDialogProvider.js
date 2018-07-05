import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationDialog as selector } from '../../selectors'
import { NewConversationDialog } from '../../components/new-conversation-dialog'

const actionNames = [
  'createRoomWithUsers',
  'showInviteToOrg',
  'showNewConversation',
  'hideNewConversation',
  'addToNewConversation',
  'removeFromNewConversation',
  'searchUsers',
  'clearRoomCreateError',
  'openPm',
]

const ConnectedNewConversationDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(NewConversationDialog)

const NewConversationDialogProvider = () => (
  <Provider store={getStore()}>
    <ConnectedNewConversationDialog />
  </Provider>
)

export default NewConversationDialogProvider
