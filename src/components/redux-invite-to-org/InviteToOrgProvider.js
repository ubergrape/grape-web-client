import React, {Component} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import {InviteToOrgDialog as selector} from '../../selectors'
import getStore from '../../app/store'
import actionNames from '../invite-to-org/actionNames'
import InviteToOrg from '../invite-to-org/InviteToOrg'

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
