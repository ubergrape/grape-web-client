import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/utils'
import {freeForInvite} from '../selectors'
import actionNames from './actionNames'
import InviteChannelMembers from './InviteChannelMembers'

const ConnectedInviteChannelMembers = connect(
  freeForInvite,
  mapActionsToProps(actionNames)
)(InviteChannelMembers)

export default function init(store) {
  return class InviteChannelMembersProvider extends Component {
    render() {
      return (
        <Provider store={store}>
          <ConnectedInviteChannelMembers />
        </Provider>
      )
    }
  }
}
