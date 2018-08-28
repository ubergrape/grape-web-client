import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { alertsAndChannelSelector as selector } from '../../selectors'
import Alerts from '../../components/old/alerts/Alerts'

const actionNames = ['enableNotifications', 'hideAlert', 'clearAlertDelay']

const ConnectedAlerts = connect(
  selector,
  mapActionsToProps(actionNames),
)(Alerts)

export default () => (
  <Provider store={getStore()}>
    <ConnectedAlerts />
  </Provider>
)
