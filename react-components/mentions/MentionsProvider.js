import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {mentionsSelector as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import Mentions from '../message-search/MessageSearch'

const actionsPropsMap = {
  loadMentions: 'load',
  hideMentions: 'hide',
  goToMessage: 'select'
}

const ConnectedMentions = connect(
  selector,
  mapActionsToProps(actionNames, actionsPropsMap)
)(Mentions)

export default class MentionsProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedMentions />
      </Provider>
    )
  }
}
