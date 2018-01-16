import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {newConversationDialog as selector} from '../../selectors'
import NewConversation from '../../components/new-conversation/NewConversation'

const actionNames = [
  'createRoomWithUsers',
  'showInviteToOrg',
  'showNewConversation',
  'hideNewConversation',
  'addToNewConversation',
  'removeFromNewConversation',
  'filterNewConversation',
  'clearRoomCreateError',
  'openPm'
]

const ConnectedNewConversation = connect(
  selector,
  mapActionsToProps(actionNames)
)(NewConversation)

export default class NewConversationProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedNewConversation />
      </Provider>
    )
  }
}
