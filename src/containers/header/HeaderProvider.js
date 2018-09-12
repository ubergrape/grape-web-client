import React, { PureComponent } from 'react'
import { Provider, connect } from 'react-redux'

import { mapActionsToProps } from '../../app/redux'
import getStore from '../../app/store'
import { headerSelector as selector } from '../../selectors'
import { Header } from '../../components/header'

const actionNames = [
  'showChannelMembersInvite',
  'showSidebar',
  'hideSidebar',
  'requestAddChannelToFavorites',
  'requestRemoveChannelFromFavorites',
  'updateMessageSearchQuery',
]

const ConnectedHeader = connect(
  selector,
  mapActionsToProps(actionNames),
)(Header)

export default class HeaderProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedHeader />
      </Provider>
    )
  }
}
