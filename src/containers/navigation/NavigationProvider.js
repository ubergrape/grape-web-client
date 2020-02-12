import React from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { navigationSelector as selector } from '../../selectors'
import Navigation from '../../components/navigation/Navigation'

const actionNames = {
  showNewConversation: 'showNewConversation',
  showManageGroups: 'showManageGroups',
  openPm: 'openPm',
  openChannelFromNavigation: 'openChannel',
  loadOlderChannels: 'loadOlderChannels',
  searchChannelsForNavigation: 'searchChannelsForNavigation',
}

const ConnectedNavigation = connect(
  selector,
  mapActionsToProps(actionNames),
)(Navigation)

export default () => (
  <Provider store={getStore()}>
    <ConnectedNavigation />
  </Provider>
)
