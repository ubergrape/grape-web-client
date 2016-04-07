import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {inviteDialog as selector} from '../../selectors'
import store from '../../app/store'
import actionNames from './actionNames'
import ChannelMembersInvite from './ChannelMembersInvite'

const ConnectedChannelMembersInvite = connect(
  selector,
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
