import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {inviteToOrgDialog as selector} from '../../selectors'
import getStore from '../../app/store'
import InviteToOrg from '../invite-to-org/InviteToOrg'

const actionNames = {
  hideInviteToOrg: 'onHide',
  getInviteToOrgLink: 'getIniviteLink',
  inviteToOrg: 'onInvite',
  clearInviteToOrgError: 'onHideError',
  hideJustInvited: 'hideJustInvited'
}

const ConnectedInviteToOrg = connect(
  selector,
  mapActionsToProps(actionNames)
)(InviteToOrg)

export default class InviteToOrgProvider extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedInviteToOrg />
      </Provider>
    )
  }
}
