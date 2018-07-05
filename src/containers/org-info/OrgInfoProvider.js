import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { orgInfoSelector as selector } from '../../selectors'
import OrgInfo from '../../components/org-info/OrgInfo'

const actionNames = {
  showInviteToOrg: 'onInvite',
  showIntro: 'onShowIntro',
}

const ConnectedOrgInfo = connect(
  selector,
  mapActionsToProps(actionNames),
)(OrgInfo)

const OrgInfoProvider = () => (
  <Provider store={getStore()}>
    <ConnectedOrgInfo />
  </Provider>
)

export default OrgInfoProvider
