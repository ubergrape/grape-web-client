import React from 'react'
import {render} from 'react-dom'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {subscriptionWarningSelector} from '../selectors'
import actionsList from './actionsList'
import SubscriptionWarning from './SubscriptionWarning'


export default function init(store, elem) {
  const ConnectedSubscriptionWarning = connect(
    subscriptionWarningSelector,
    mapActionsToProps(actionsList)
  )(SubscriptionWarning)

  return render(
    <Provider store={store}>
      <ConnectedSubscriptionWarning/>
    </Provider>,
    elem
  )
}
