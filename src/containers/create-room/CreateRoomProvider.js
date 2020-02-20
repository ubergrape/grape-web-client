import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { createRoomSelector } from '../../selectors'
import { CreateRoom } from '../../components/new/create-room'

const actionNames = {
  onSearchUsersCreateRoom: 'onSearchUsers',
  onChangeFilterCreateRoom: 'onChangeFilter',
  onChangeViewNewConversation: 'onChangeView',
  onChangeNameCreateRoom: 'onChangeName',
  onChangeColorCreateRoom: 'onChangeColor',
  onChangeTypeCreateRoom: 'onChangeType',
  onChangeDescriptionCreateRoom: 'onChangeDescription',
  onAddMemberCreateRoom: 'onAddMember',
  onDeleteMemberCreateRoom: 'onDeleteMember',
  onCreateRoom: 'onCreateRoom',
  onHideNewConversation: 'onHide',
}

const ConnectedCreateRoom = connect(
  createRoomSelector,
  mapActionsToProps(actionNames),
)(CreateRoom)

export default () => (
  <Provider store={getStore()}>
    <ConnectedCreateRoom />
  </Provider>
)
