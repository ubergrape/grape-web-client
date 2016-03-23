import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {typingNotificationSelector as selector} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import TypingNotification from './TypingNotification'

const ConnectedTypingNotification = connect(
  selector,
  mapActionsToProps(actionNames)
)(TypingNotification)

export default class TypingNotificationProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedTypingNotification />
      </Provider>
    )
  }
}
