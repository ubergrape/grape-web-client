import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {newConversationDialog as selector} from '../../selectors'
import getStore from '../../app/store'
import actionNames from './actionNames'
import NewConversation from './NewConversation'

const ConnectedNewConversation = connect(
  selector,
  mapActionsToProps(actionNames)
)(NewConversation)

export default class NewConversationProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedNewConversation />
      </Provider>
    )
  }
}
