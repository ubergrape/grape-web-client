import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as actions from '../actions'
import actionsList from './actionsList'

import SubscriptionWarning from './SubscriptionWarning'

export default function init(store, elem) {
  let ConnectedSubscriptionWarning = connect(
    mapStateToProps,
    mapActionsToProps
  )(SubscriptionWarning)

  render(
    <Provider store={store}>
      <ConnectedSubscriptionWarning />
    </Provider>,
    elem
  )
}

// TODO: possibly use 'reselect': https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {...state.subscriptionWarning}
}

function mapActionsToProps(dispatch) {
  let bindedActions = bindActionCreators(actions, dispatch)

  return actionsList.reduce(
    (selectedActions, actionName) => {
      let action = bindedActions[actionName]
      if (action) selectedActions[actionName] = action
      return selectedActions
    },
    {}
  )
}
