import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { browserNotificationComponentSelector } from '../../selectors'
import getStore from '../../app/store'
import { BrowserNotification } from '../../components/old/browser-notification'

const actionNames = {
  goToChannel: 'onGoToChannel',
  joinIncomingCall: 'joinCall',
  setNotification: 'setNotification',
}

const ConnectedBrowserNotification = connect(
  browserNotificationComponentSelector,
  mapActionsToProps(actionNames),
)(BrowserNotification)

export default () => (
  <Provider store={getStore()}>
    <ConnectedBrowserNotification />
  </Provider>
)
