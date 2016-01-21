import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {mapActionsToProps} from '../app/redux'
import {alertsAndChannelSelector} from '../selectors'
import actionNames from './actionNames'

import Alerts from './Alerts'

const ConnectedAlerts = connect(
  alertsAndChannelSelector,
  mapActionsToProps(actionNames)
)(Alerts)

export default function init(store) {
  return class AlertsProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedAlerts />
        </Provider>
      )
    }
  }
}
