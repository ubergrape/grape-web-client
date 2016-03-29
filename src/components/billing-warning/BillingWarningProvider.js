import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {billingWarningSelector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import BillingWarning from './BillingWarning'

const ConnectedBillingWarning = connect(
  billingWarningSelector,
  mapActionsToProps(actionNames)
)(BillingWarning)

export default class BillingWarningProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedBillingWarning />
      </Provider>
    )
  }
}
