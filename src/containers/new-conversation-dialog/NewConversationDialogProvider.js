import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationComponentSelector as selector } from '../../selectors'
import { NewConversationDialog } from '../../components/new/new-conversation'

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

export default () => (
  <Provider store={getStore()}>
    <ConnectedNewConversationDialog />
  </Provider>
)
