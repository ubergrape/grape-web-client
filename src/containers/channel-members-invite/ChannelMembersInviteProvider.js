import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { inviteDialogSelector as selector } from '../../selectors'
import ChannelMembersInvite from '../../components/channel-members-invite/ChannelMembersInvite'

const actionNames = [
  'showInviteToOrg',
  'inviteToChannel',
  'hideChannelMembersInvite',
  'addToChannelMembersInvite',
  'removeFromChannelMembersInvite',
  'searchUsersToInvite',
  'showToastNotification',
  'goTo',
]

const ConnectedChannelMembersInvite = connect(
  selector,
  mapActionsToProps(actionNames),
)(ChannelMembersInvite)

export default () => (
  <Provider store={getStore()}>
    <ConnectedChannelMembersInvite />
  </Provider>
)
