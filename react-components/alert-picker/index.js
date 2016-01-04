import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'
import {mapActionsToProps} from '../app/utils'
import {alertsAndChannelSelector} from '../selectors'
import actionNames from './actionNames'

import AlertPicker from './AlertPicker'

const ConnectedAlertPicker = connect(
  alertsAndChannelSelector,
  mapActionsToProps(actionNames)
)(AlertPicker)

export default function init(store) {
  return class AlertPickerProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedAlertPicker />
        </Provider>
      )
    }
  }
}
