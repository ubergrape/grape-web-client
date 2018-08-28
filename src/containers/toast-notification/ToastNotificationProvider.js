import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { toastNotificationSelector as selector } from '../../selectors'
import { ToastNotification } from '../../components/old/toast-notification'

const actionNames = {
  hideToastNotification: 'onDismiss',
}

const ConnectedToastNotification = connect(
  selector,
  mapActionsToProps(actionNames),
)(ToastNotification)

export default () => (
  <Provider store={getStore()}>
    <ConnectedToastNotification />
  </Provider>
)
