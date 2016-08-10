import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {historyComponentSelector as selector} from '../../selectors'
import getStore from '../../app/store'
import History from '../history/History'

const actionNames = {
  loadHistory: 'onLoad',
  renderOlderHistory: 'onTouchTopEdge',
  unsetHistoryScrollTo: 'onUserScrollAfterScrollTo',
  removeMessage: 'onRemove',
  editMessage: 'onEdit',
  resendMessage: 'onResend',
  readMessage: 'onRead'
}

const ConnectedHistory = connect(
  selector,
  mapActionsToProps(actionNames)
)(History)

export default class HistoryProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedHistory />
      </Provider>
    )
  }
}
