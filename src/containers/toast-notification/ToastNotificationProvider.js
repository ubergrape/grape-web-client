import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { toastNotificationSelector as selector } from '../../selectors'
import { ToastNotification } from '../../components/toast-notification'

const actionNames = {
  hideToastNotification: 'onDismiss',
}

const ConnectedToastNotification = connect(
  selector,
  mapActionsToProps(actionNames),
)(ToastNotification)

const ToastNotificationProvider = () => (
  <Provider store={getStore()}>
    <ConnectedToastNotification />
  </Provider>
)

export default ToastNotificationProvider
