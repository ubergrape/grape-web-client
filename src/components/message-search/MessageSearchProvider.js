import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {messageSearchSelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import MessageSearch from './MessageSearch'

const actionsPropsMap = {
  searchMessages: 'load',
  hideMessageSearch: 'hide',
  goToMessage: 'select'
}

const ConnectedMessageSearch = connect(
  selector,
  mapActionsToProps(actionNames, actionsPropsMap)
)(MessageSearch)

export default class MessageSearchProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedMessageSearch />
      </Provider>
    )
  }
}
