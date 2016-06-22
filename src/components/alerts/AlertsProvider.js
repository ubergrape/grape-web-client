import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {alertsAndChannelSelector as selector} from '../../selectors'
import getStore from '../../app/store'
import actionNames from './actionNames'
import Alerts from './Alerts'

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
