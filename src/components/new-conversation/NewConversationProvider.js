import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {newConversationSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import NewConversation from './NewConversation'

const ConnectedNewConversation = connect(
  selector,
  mapActionsToProps(actionNames)
)(NewConversation)

export default class NewConversationProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedNewConversation />
      </Provider>
    )
  }
}
