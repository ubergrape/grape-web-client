import React, { PureComponent } from 'react'
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

export default class ToastNotificationProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedToastNotification />
      </Provider>
    )
  }
}
