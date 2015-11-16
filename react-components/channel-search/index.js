import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import actionsList from './actionsList'

import ChannelSearch from './ChannelSearch'

export default function init(store, elem) {
  function selectActions() {
    let bindedActions = bindActionCreators(actions, store.dispatch)

    return actionsList.reduce(
      (selectedActions, actionName) => {
        let action = bindedActions[actionName]
        if (action) selectedActions[actionName] = action
        return selectedActions
      },
      {}
    )
  }

  render(
    <Provider store={store}>
      <ChannelSearch actions={selectActions()}/>
    </Provider>,
    elem
  )
}
