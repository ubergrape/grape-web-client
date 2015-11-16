import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../actions'
import actionsList from './actionsList'

import ChannelSearch from './ChannelSearch'

export default function init(store, elem) {
  let ConnectedChannelSearch = connect(mapStateToProps, mapActionsToProps)(ChannelSearch)

  render(
    <Provider store={store}>
      <ConnectedChannelSearch/>
    </Provider>,
    elem
  )
}

// TODO: possibly use 'reselect': https://github.com/faassen/reselect
function mapStateToProps(state) {
  return {...state.channelSearch}
}

function mapActionsToProps(dispatch) {
  let bindedActions = bindActionCreators(actions, dispatch)

  return {
    actions: actionsList.reduce(
      (selectedActions, actionName) => {
        let action = bindedActions[actionName]
        if (action) selectedActions[actionName] = action
        return selectedActions
      },
      {}
    )
  }
}
