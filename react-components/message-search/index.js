import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {messageSearchSelector} from '../selectors'
import actions from './actions'
import MessageSearch from './MessageSearch'

const actionsPropsMap = {
  searchMessages: 'load',
  hideMessageSearch: 'hide',
  goToMessage: 'select'
}

const ConnectedMessageSearch = connect(
  messageSearchSelector,
  mapActionsToProps(actions, actionsPropsMap)
)(MessageSearch)

export default function init(store) {
  return class MessageSearchProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedMessageSearch />
        </Provider>
      )
    }
  }
}
