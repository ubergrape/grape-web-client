import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {inviteDialogSelector as selector} from '../../selectors'
import getStore from '../../app/store'
import actionNames from './actionNames'
import ChannelMembersInvite from './ChannelMembersInvite'

const ConnectedChannelMembersInvite = connect(
  selector,
  mapActionsToProps(actionNames)
)(ChannelMembersInvite)

export default class ChannelMembersInviteProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedChannelMembersInvite />
      </Provider>
    )
  }
}
