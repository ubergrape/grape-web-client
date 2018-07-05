import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { inviteToOrgDialog as selector } from '../../selectors'
import InviteToOrg from '../../components/invite-to-org/InviteToOrg'

const actionNames = {
  hideInviteToOrg: 'onHide',
  getInviteToOrgLink: 'getIniviteLink',
  inviteToOrg: 'onInvite',
  clearInviteToOrgError: 'onHideError',
  showToastNotification: 'onSuccess',
}

const ConnectedInviteToOrg = connect(
  selector,
  mapActionsToProps(actionNames),
)(InviteToOrg)

export default class InviteToOrgProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedInviteToOrg />
      </Provider>
    )
  }
}
