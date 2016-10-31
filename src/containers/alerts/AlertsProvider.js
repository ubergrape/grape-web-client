import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {alertsAndChannelSelector as selector} from '../../selectors'
import Alerts from '../../components/alerts/Alerts'

const actionNames = [
  'enableNotifications',
  'hideAlert',
  'clearAlertDelay'
]

const ConnectedAlerts = connect(
  selector,
  mapActionsToProps(actionNames)
)(Alerts)

export default class AlertsProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedAlerts />
      </Provider>
    )
  }
}
