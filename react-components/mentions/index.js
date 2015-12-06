import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {mentionsSelector} from '../selectors'
import actions from './actions'
import Mentions from '../message-search/MessageSearch'

const actionsPropsMap = {
  loadMentions: 'load',
  hideMentions: 'hide',
  goToMessage: 'select'
}

const ConnectedMentions = connect(
  mentionsSelector,
  mapActionsToProps(actions, actionsPropsMap)
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
