import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationSelector } from '../../selectors'
import { NewConversation } from '../../components/new/new-conversation'

const actionNames = [
  'changeTabNewConversation',
  'showNewConversation',
  'hideNewConversation',
  'changeInputUsersNewConversation',
  'changeInputGroupsNewConversation',
  'searchUsersNewConversation',
  'searchGroupsNewConversation',
]

const ConnectedNewConversation = connect(
  newConversationSelector,
  mapActionsToProps(actionNames),
)(NewConversation)

export default () => (
  <Provider store={getStore()}>
    <ConnectedNewConversation />
  </Provider>
)
