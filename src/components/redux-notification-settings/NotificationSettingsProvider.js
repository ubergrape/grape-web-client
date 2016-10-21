import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {notificationSettingsSelector as selector} from '../../selectors'
import getStore from '../../app/store'
import NotificationSettings from '../notification-settings/NotificationSettings'

const actionNames = {
  hideNotificationSettings: 'onHide',
  setNotificationSetting: 'onChange',
  leaveChannel: 'onLeave'
}

const ConnectedNotificationSettings = connect(
  selector,
  mapActionsToProps(actionNames)
)(NotificationSettings)

export default class NotificationSettingsProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedNotificationSettings />
      </Provider>
    )
  }
}
