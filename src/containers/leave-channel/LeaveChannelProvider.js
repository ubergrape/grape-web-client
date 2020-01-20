import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { leaveChannelComponentSelector as selector } from '../../selectors'
import { LeaveChannel } from '../../components/old/leave-channel'

const actionNames = ['hideLeaveChannelDialog', 'onLeaveChannel']

const ConnectedLeaveChannel = connect(
  selector,
  mapActionsToProps(actionNames),
)(LeaveChannel)

export default () => (
  <Provider store={getStore()}>
    <ConnectedLeaveChannel />
  </Provider>
)
