import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { roomDeleteSelector as selector } from '../../selectors'
import { RoomDeleteDialog } from '../../components/old/room-delete'

const actionNames = {
  hideRoomDeleteDialog: 'onHide',
  deleteChannel: 'onDelete',
}

const ConnectedRoomDeleteDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(RoomDeleteDialog)

export default () => (
  <Provider store={getStore()}>
    <ConnectedRoomDeleteDialog />
  </Provider>
)
