import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {historySelector as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import History from './History'

const ConnectedHistory = connect(
  selector,
  mapActionsToProps(actionNames)
)(History)

export default class HistoryProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedHistory />
      </Provider>
    )
  }
}
