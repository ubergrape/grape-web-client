import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import { billingWarningSelector } from '../../selectors'
import getStore from '../../app/store'
import BillingWarning from '../../components/billing-warning/BillingWarning'

const actionNames = ['showBillingWarning', 'hideBillingWarning', 'goToPayment']

const ConnectedBillingWarning = connect(
  billingWarningSelector,
  mapActionsToProps(actionNames),
)(BillingWarning)

export default class BillingWarningProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedBillingWarning />
      </Provider>
    )
  }
}
