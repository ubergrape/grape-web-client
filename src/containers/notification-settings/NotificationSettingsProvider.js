import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { notificationSettingsComponentSelector as selector } from '../../selectors'
import NotificationSettings from '../../components/old/notification-settings/NotificationSettings'

const actionNames = {
  hideNotificationSettings: 'onHide',
  setNotificationSetting: 'onChange',
  onLeaveChannel: 'onLeave',
}

const ConnectedNotificationSettings = connect(
  selector,
  mapActionsToProps(actionNames),
)(NotificationSettings)

export default () => (
  <Provider store={getStore()}>
    <ConnectedNotificationSettings />
  </Provider>
)
