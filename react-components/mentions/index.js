import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import boundActions from '../app/boundActions'
import {mentionsSelector} from '../selectors'
import actions from './actions'
import Mentions from '../message-search/MessageSearch'

const ConnectedMentions = connect(
  mentionsSelector,
  mapActionsToProps(actions)
)(Mentions)

export default function init(store) {
  return class MentionsProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedMentions />
        </Provider>
      )
    }
  }
}

const actionsPropsMap = {
  loadMentions: 'load',
  hideMentions: 'hide'
}

function mapActionsToProps(actionsNames) {
  return dispatch => {
    return actionsNames.reduce(
      (selectedActions, actionName) => {
        let action = boundActions[actionName]
        if (action) selectedActions[actionsPropsMap[actionName] || actionName] = action
        return selectedActions
      },
      {}
    )
  }
}
