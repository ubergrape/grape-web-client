import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {typingNotificationSelector} from '../selectors'
import actionsList from './actionsList'
import TypingNotification from './TypingNotification'

const ConnectedTypingNotification = connect(
  typingNotificationSelector,
  mapActionsToProps(actionsList)
)(TypingNotification)

export default function init(store) {
  return class TypingNotificationProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedTypingNotification />
        </Provider>
      )
    }
  }
}
