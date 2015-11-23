import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {subscriptionWarningSelector} from '../selectors'
import actionsList from './actionsList'
import SubscriptionWarning from './SubscriptionWarning'

const ConnectedSubscriptionWarning = connect(
  subscriptionWarningSelector,
  mapActionsToProps(actionsList)
)(SubscriptionWarning)

export default function init(store) {
  return class SubscriptionWarningProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedSubscriptionWarning />
        </Provider>
      )
    }
  }
}
