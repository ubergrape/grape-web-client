import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { incomingCallSelector as selector } from '../../selectors'
import { IncomingCall } from '../../components/incoming-call'

const actionNames = [
  'updateCallTimer',
  'closeIncomingCall',
  'rejectIncomingCall',
  'joinIncomingCall',
]

const ConnectedIncomingCall = connect(
  selector,
  mapActionsToProps(actionNames),
)(IncomingCall)

export default () => (
  <Provider store={getStore()}>
    <ConnectedIncomingCall />
  </Provider>
)
