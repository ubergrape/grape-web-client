import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { navigationSelector as selector } from '../../selectors'
import Navigation from '../../components/navigation/Navigation'

const actionNames = [
  'showNewConversation',
  'showManageGroups',
  'goToChannel',
  'openPm',
  'joinChannel',
  'searchChannelsForNavigation',
]

const ConnectedNavigation = connect(
  selector,
  mapActionsToProps(actionNames),
)(Navigation)

const NavigationProvider = () => (
  <Provider store={getStore()}>
    <ConnectedNavigation />
  </Provider>
)

export default NavigationProvider
