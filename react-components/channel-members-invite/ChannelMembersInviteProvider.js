import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../app/redux'
import {inviteDialog} from '../selectors'
import store from '../app/store'
import actionNames from './actionNames'
import ChannelMembersInvite from './ChannelMembersInvite'

const ConnectedChannelMembersInvite = connect(
  inviteDialog,
  mapActionsToProps(actionNames)
)(ChannelMembersInvite)

export default class ChannelMembersInviteProvider extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedChannelMembersInvite />
      </Provider>
    )
  }
}
