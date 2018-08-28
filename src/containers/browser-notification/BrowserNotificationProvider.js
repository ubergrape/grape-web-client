import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { browserNotificationSelector } from '../../selectors'
import getStore from '../../app/store'
import { BrowserNotification } from '../../components/old/browser-notification'

const actionNames = {
  goToChannel: 'onGoToChannel',
}

const ConnectedBrowserNotification = connect(
  browserNotificationSelector,
  mapActionsToProps(actionNames),
)(BrowserNotification)

export default () => (
  <Provider store={getStore()}>
    <ConnectedBrowserNotification />
  </Provider>
)
