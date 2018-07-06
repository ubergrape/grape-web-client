import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { browserNotificationSelector } from '../../selectors'
import getStore from '../../app/store'
import { BrowserNotification } from '../../components/browser-notification'

const actionNames = {
  goToChannel: 'onGoToChannel',
}

const ConnectedBrowserNotification = connect(
  browserNotificationSelector,
  mapActionsToProps(actionNames),
)(BrowserNotification)

export default class BrowserNotificationProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedBrowserNotification />
      </Provider>
    )
  }
}
