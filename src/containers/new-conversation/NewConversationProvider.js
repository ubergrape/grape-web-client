import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { newConversationSelector } from '../../selectors'
import { NewConversation } from '../../components/new/new-conversation'

const actionNames = [
  'onShow',
  'onHide',
  'onChangeTab',
  'onChangeView',
  'onChangeInputUsers',
  'onChangeInputGroups',
  'onSearchUsers',
  'onSearchGroups',
  'onChangeNewRoomColor',
  'onChangeNewRoomName',
  'onChangeNewRoomType',
  'onChangeNewRoomDescription',
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
