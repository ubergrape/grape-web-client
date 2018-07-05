import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { roomDeleteSelector as selector } from '../../selectors'
import { RoomDeleteDialog } from '../../components/room-delete'

const actionNames = {
  hideRoomDeleteDialog: 'onHide',
  deleteChannel: 'onDelete',
}

const ConnectedRoomDeleteDialog = connect(
  selector,
  mapActionsToProps(actionNames),
)(RoomDeleteDialog)

const RoomDeleteDialogProvider = () => (
  <Provider store={getStore()}>
    <ConnectedRoomDeleteDialog />
  </Provider>
)

export default RoomDeleteDialogProvider
