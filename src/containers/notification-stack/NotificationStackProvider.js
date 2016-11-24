import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {notificationStackSelector as selector} from '../../selectors'
import {NotificationStack} from '../../components/notification-stack'

const actionNames = {
  requestRemoveNotificationStack: 'onDismiss'
}

const ConnectedNotificationStack = connect(
  selector,
  mapActionsToProps(actionNames)
)(NotificationStack)

export default class NotificationStackProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedNotificationStack />
      </Provider>
    )
  }
}
