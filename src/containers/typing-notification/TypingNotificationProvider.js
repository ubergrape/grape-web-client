import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {typingNotificationSelector as selector} from '../../selectors'
import TypingNotification from '../../components/typing-notification/TypingNotification'

const actionNames = [
  'setUsers',
  'cleanupTyping'
]

const ConnectedTypingNotification = connect(
  selector,
  mapActionsToProps(actionNames)
)(TypingNotification)

export default class TypingNotificationProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedTypingNotification />
      </Provider>
    )
  }
}
