import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {billingWarningSelector} from '../selectors'
import actionNames from './actionNames'
import BillingWarning from './BillingWarning'

const ConnectedBillingWarning = connect(
  billingWarningSelector,
  mapActionsToProps(actionNames)
)(BillingWarning)

export default function init(store) {
  return class BillingWarningProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedBillingWarning />
        </Provider>
      )
    }
  }
}
